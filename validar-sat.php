<?php
// URL del CSV oficial del SAT (Listado Completo 69-B)
$url_sat = "http://omawww.sat.gob.mx/procuraciondejusticia/paginas/documentos/listado_completo_69b.csv";

$rfc_a_consultar = strtoupper($_GET['rfc']);
$encontrado = false;

// Abrir el archivo directamente desde la URL del SAT
if (($gestor = fopen($url_sat, "r")) !== FALSE) {
    while (($datos = fgetcsv($gestor, 1000, ",")) !== FALSE) {
        // El RFC suele estar en la primera o segunda columna del CSV del SAT
        if ($datos[1] == $rfc_a_consultar) {
            $encontrado = true;
            break;
        }
    }
    fclose($gestor);
}

echo json_encode(["enListaNegra" => $encontrado]);
?>