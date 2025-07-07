<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");
session_start();

include '../php-files/db_connection.php';

// Debug log file – review this file for troubleshooting upload issues.
$debugFile = "C:/xampp/htdocs/DSC115-Project/images/user-img/debug.log";
file_put_contents($debugFile, "upload-image.php called at " . date("Y-m-d H:i:s") . "\n", FILE_APPEND);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Log the incoming $_FILES array for debugging
    file_put_contents($debugFile, "FILES: " . print_r($_FILES, true) . "\n", FILE_APPEND);

    if (isset($_FILES['profile_image']) && $_FILES['profile_image']['error'] == 0) {
        $allowed = array(
            "jpg"  => "image/jpeg",
            "jpeg" => "image/jpeg",
            "png"  => "image/png"
        );
        $filename  = $_FILES["profile_image"]["name"];
        $filetype  = $_FILES["profile_image"]["type"];
        $filesize  = $_FILES["profile_image"]["size"];

        // Verify file extension
        $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        if (!array_key_exists($ext, $allowed)) {
            echo json_encode(["success" => false, "message" => "Invalid file format."]);
            exit;
        }

        // Verify file size (1MB maximum)
        if ($filesize > 1 * 1024 * 1024) {
            echo json_encode(["success" => false, "message" => "File size exceeds limit."]);
            exit;
        }

        // Verify MIME type
        if (!in_array($filetype, $allowed)) {
            echo json_encode(["success" => false, "message" => "Incorrect MIME type."]);
            exit;
        }

        // Create a unique filename and define destination path
        $newFilename = uniqid() . "." . $ext;
        $destination = "C:/xampp/htdocs/DSC115-Project/images/user-img/" . $newFilename;
        
        if (move_uploaded_file($_FILES["profile_image"]["tmp_name"], $destination)) {
            file_put_contents($debugFile, "File moved to: $destination\n", FILE_APPEND);

            // Update the user's record in the database and update the session
            if (isset($_SESSION['user_id'])) {
                $userId = $_SESSION['user_id'];
                // Update these parameters with your actual database credentials
                $servername = "localhost";
                $dbUsername = "root";
                $dbPassword = "";
                $dbName = "woutechdb";
                $conn = new mysqli($servername, $dbUsername, $dbPassword, $dbName);
                if ($conn->connect_error) {
                    echo json_encode(["success" => false, "message" => "DB connection failed: " . $conn->connect_error]);
                    exit;
                }
                $stmt = $conn->prepare("UPDATE users SET profile_image = ? WHERE user_id = ?");
                $stmt->bind_param("si", $newFilename, $userId);
                if (!$stmt->execute()) {
                    echo json_encode(["success" => false, "message" => "DB update failed: " . $stmt->error]);
                    $stmt->close();
                    $conn->close();
                    exit;
                }
                $stmt->close();
                $conn->close();

                // Update the session so that subsequent calls return the updated image filename
                $_SESSION['profile_image'] = $newFilename;
            }
            echo json_encode(["success" => true, "image" => $newFilename]);
        } else {
            echo json_encode(["success" => false, "message" => "Failed to move the uploaded file."]);
        }
    } else {
        $error = isset($_FILES["profile_image"]["error"]) ? $_FILES["profile_image"]["error"] : "No file received";
        echo json_encode(["success" => false, "message" => "Error: " . $error]);
    }
}
?>
