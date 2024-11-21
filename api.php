<?php
// Establecer la cabecera para indicar que los datos son en formato JSON
header('Content-Type: application/json');

// Cabeceras para permitir solicitudes CORS (si es necesario)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$host = 'junction.proxy.rlwy.net';  // Host de PostgreSQL desde la URL de conexión pública
$port = '21824';  // Puerto de la URL de conexión pública
$dbname = 'railway';  // Nombre de la base de datos
$username = 'postgres';  // Usuario
$password = 'DZPJJGlePMtBqPuWVwpiifqWyvvKkpuI';  // Contraseña

try {
    // Conexión PDO a PostgreSQL
    $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // echo "Conexión exitosa a PostgreSQL."; // Descomentar para ver si la conexión fue exitosa
} catch (PDOException $e) {
    echo json_encode(["error" => "Error de conexión: " . $e->getMessage()]);
    die();
}

// Obtener el método de la solicitud
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        // Agregar un dinosaurio
        $data = json_decode(file_get_contents('php://input'), true);
        // Validar si los datos están presentes
        if (empty($data['nombre']) || empty($data['especie']) || empty($data['periodo'])) {
            echo json_encode(['error' => 'Faltan datos obligatorios']);
            break;
        }

        // Preparar la consulta de inserción
        $stmt = $pdo->prepare("INSERT INTO dinosaurios (nombre, especie, periodo, descripcion, imagen) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$data['nombre'], $data['especie'], $data['periodo'], $data['descripcion'], $data['imagen']]);
        
        // Obtener el último ID insertado
        $data['id'] = $pdo->lastInsertId();
        
        // Devolver el dinosaurio agregado
        echo json_encode($data);
        break;

    case 'PUT':
        // Actualizar un dinosaurio existente
        $data = json_decode(file_get_contents('php://input'), true);
        // Validar si los datos están presentes
        if (empty($data['id']) || empty($data['nombre']) || empty($data['especie']) || empty($data['periodo'])) {
            echo json_encode(['error' => 'Faltan datos obligatorios']);
            break;
        }

        // Preparar la consulta de actualización
        $stmt = $pdo->prepare("UPDATE dinosaurios SET nombre = ?, especie = ?, periodo = ?, descripcion = ?, imagen = ? WHERE id = ?");
        $stmt->execute([$data['nombre'], $data['especie'], $data['periodo'], $data['descripcion'], $data['imagen'], $data['id']]);
        
        // Devolver el dinosaurio actualizado
        echo json_encode($data);
        break;

    case 'DELETE':
        // Eliminar un dinosaurio
        $id = $_GET['id'];
        if (empty($id)) {
            echo json_encode(['error' => 'ID de dinosaurio no proporcionado']);
            break;
        }
        
        $stmt = $pdo->prepare("DELETE FROM dinosaurios WHERE id = ?");
        $stmt->execute([$id]);
        
        // Devolver una respuesta de éxito
        echo json_encode(['message' => 'Dinosaurio eliminado']);
        break;

    case 'GET':
        // Verifica si el parámetro 'id' está presente en la URL
        if (isset($_GET['id'])) {
            // Obtener dinosaurio por ID
            $stmt = $pdo->prepare("SELECT * FROM dinosaurios WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            $dino = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($dino) {
                // Devolver el dinosaurio encontrado
                echo json_encode($dino);
            } else {
                // Si no se encuentra el dinosaurio, devolver un error
                echo json_encode(['error' => 'Dinosaurio no encontrado']);
            }
        } else {
            // Si no se proporciona un ID, obtener todos los dinosaurios
            $stmt = $pdo->query("SELECT * FROM dinosaurios");
            $dinosaurios = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($dinosaurios);
        }
        break;

    default:
        echo json_encode(['error' => 'Método no permitido']);
        break;
}
?>
