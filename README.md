# Agendly - Sistema de Gestión de Reservas

## Datos del Estudiante
- **Alumno:** Jose Miguel Gutierrez Beltran
- **Carrera:** Licenciatura en Informática (Modalidad Virtual)
- **Institución:** Universidad Autónoma de Sinaloa (UAS)
- **Materia:** Taller Integrador de Especialización
- **Docente:** MGTI Alexis Moises Montaño Araujo

---

## 1. Descripción del proyecto
Agendly es una solución web funcional desarrollada de forma individual para la evaluación extraordinaria de la materia. El sistema automatiza y centraliza la asignación de espacios físicos (cubículos, laboratorios y salas), optimizando la logística de horarios y evitando conflictos de disponibilidad en entornos académicos u organizacionales.

## 2. Entidad principal
La entidad principal del sistema es **Reservas**, la cual interactúa directamente con una base de datos relacional y cuenta con los siguientes atributos: id, nombre_usuario, espacio_id, fecha_reserva, hora_inicio y hora_fin.

## 3. Funcionalidades (CRUD)
El sistema cuenta con un flujo operativo completo y libre de errores:
- **Creación (Create):** Registro de nuevas reservaciones mediante un formulario interactivo con auto-formato.
- **Consulta (Read):** Visualización en tiempo real de las citas agendadas en un panel estructurado.
- **Actualización (Update):** Modificación dinámica de los datos de una reserva existente al presionar "Editar".
- **Eliminación (Delete):** Cancelación y borrado físico de registros directamente desde el panel de control.

## 4. Reglas de negocio
Para garantizar la integridad y consistencia de los datos, se implementaron dos reglas primordiales:
1. **Formateo Estricto (Frontend):** Conversión automática de entradas numéricas simples a un formato válido de tiempo `HH:mm:ss` al perder el foco de las cajas de texto.
2. **Validación de Choque de Horarios (Backend):** Bloqueo y restricción inmediata en el servidor mediante consultas estructuradas si se intenta reservar un mismo espacio en un rango de fecha y hora que ya se encuentra ocupado.

## 5. Tecnologías utilizadas
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla JS)
- **Backend:** Node.js, Express
- **Base de Datos:** Microsoft SQL Server (Persistencia Relacional)

## 6. Instrucciones de ejecución
1. Clonar el repositorio localmente o descargar las carpetas del proyecto.
2. Ejecutar el siguiente script en tu instancia de SQL Server para crear la estructura de persistencia:
   ```sql
   CREATE TABLE Reservas (
       id INT IDENTITY(1,1) PRIMARY KEY,
       nombre_usuario VARCHAR(100) NOT NULL,
       espacio_id INT NOT NULL,
       fecha_reserva DATE NOT NULL,
       hora_inicio VARCHAR(8) NOT NULL,
       hora_fin VARCHAR(8) NOT NULL
   );