<?php
header('Content-Type: text/plain; charset=utf-8');

function removeSpecChars($string) {
	setlocale(LC_ALL, "en_US.utf8"); 
	$string = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $string);
	return preg_replace('~[^a-z0-9- ]+~', '', strtolower($string));
}

$json = json_decode(file_get_contents('../resources/instruments.json'), true);

$index = [];

$flat = $json;



foreach($flat as $key => $entry) {
	$flat[$key]['fretOffset'] = !empty($entry['fretOffset']);
	foreach ($entry as $name => $data) {
		if(is_string($data)) {
			$flat[$key][$name] = removeSpecChars($data);
		}
		else if($name === 'notes'){
			$newData = [];
			foreach($data as $course => $notes) {
				if(is_array($notes)) {
					$notes = array_shift($notes);
				}
				$newData[] = preg_replace('~[\d]+~', '', $notes);
			}
			$newData = implode(',', $newData);
			$flat[$key]['notes'] = $newData;
		}
	}
}


foreach($flat as $key => $entry) {
	foreach ($entry as $name => $data) {
		if($name === 'fretOffset') {
			if(false !== $data) {
				$index['fretOffset'][] = $key;
			}
			continue;
		}
		else if($name === 'fretted') {
			if(true === $data) {
				$index['fretted'][] = $key;
			}
			else if(false === $data) {
				$index['unfretted'][] = $key;
			}
			continue;
		}
		else {			
			$index[$name][$data][] = $key;
		}
	}
}

$full = [
	'index' => $index,
	'flat' => $flat,
	'json' => $json
];


file_put_contents('../data/instruments-all.json', json_encode($full));
file_put_contents('../data/instruments-flat.json', json_encode($flat));
file_put_contents('../data/instruments-index.json', json_encode($index));
file_put_contents('../data/instruments-base.json', json_encode($json));

