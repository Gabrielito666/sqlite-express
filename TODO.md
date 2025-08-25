5) Testear
(PREPARE HAY QUE IMPLEMENTARLE UN FINALIZE::: ADEMAS db.prepare es sync... ojo con eso)

WHERE cambios: Ahora solo se permite:

sentencia con igaual por defecto:
{ [colName]: CellValue }

sentencia con operator comparision:
["colName", "="|"<"|etc..., value]

sentencia con operador de lista ("IN" y "NOT IN")
["colName", "IN"|"NOT IN", value]

union lógica de sentencias:
{
    AND: [Lista de sentencias como las anteriores]
}
{
    OR:  [Lista de sentencias como las anteriores]
}

ya no hay connector

# QUEDE EN EL TESD DE EXIST