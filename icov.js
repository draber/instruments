const str = "Crème Brulée"
str.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
> 'Creme Brulee'