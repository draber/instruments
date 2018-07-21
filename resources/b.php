<?php

$all = [];
foreach(glob('./a/*.html') as $file) {
	$content = file_get_contents($file);
	$content = @array_pop(explode('<div id="welcome_text">', $content));
	$content = @array_shift(explode('</div>', $content));
	$content = explode('<hr><br>', $content);
	foreach($content as $instrument) {
		if(false !== strpos($instrument, '<h3>')){
			$instrument = str_replace(["\n", '#'], ['', '♯'], trim($instrument));
			$instrument = explode("|", str_replace("><", ">|<", $instrument));
			$instrument = array_filter(array_map('strip_tags', $instrument));
			$instrument = array_merge($instrument);
			if(strlen($instrument[0]) === 1){
				unset($instrument[0]);
			}
			$instrument = array_map('trim', array_merge($instrument));
			$parsed = [];
			foreach($instrument as $i => $value) {
				if($i === 0) {
					$key = 'Name';
				}
				else {
					$key = substr($value, 0, strpos($value, ':'));
					$value = trim(trim(substr($value, strpos($value, ':') + 1)),'.');
					if($key === 'Alternative names') {
						$value = array_map('trim', explode(',',$value));
					}
					else if($key === 'Origin') {
						continue;
					}
					else if($key === 'Further notes') {
						continue;
					}
				}
				$parsed[$key] = $value;
			}
			$all[] = $parsed;
		}
	}
}

file_put_contents('a.json', json_encode(['source' => 'https://stringedinstrumentdatabase.aornis.com/', 'data' => $all], JSON_PRETTY_PRINT));
\console::log($all);
