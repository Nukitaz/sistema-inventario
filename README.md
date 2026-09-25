# Sistema de Gestión de Inventario

![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg?style=flat&logo=nodedotjs)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg?style=flat&logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg?style=flat&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue.svg?style=flat&logo=docker)
![Frontend](https://img.shields.io/badge/Frontend-Vanilla_JS_--_HTML5_--_CSS3-orange.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

Sistema integral de gestión de inventario diseñado para el control eficiente de stock, productos y movimientos en tiempo real. La arquitectura está desacoplada para optimizar la escalabilidad, el rendimiento y la facilidad de despliegue.

## Arquitectura del Sistema

El proyecto sigue una arquitectura desacoplada cliente-servidor:

* **Backend (`/backend`):** API RESTful desarrollada con **Node.js** y **Express**. Gestiona la lógica de negocio, autenticación basada en tokens (JWT) y la interacción con la base de datos relacional **PostgreSQL**.
* **Frontend (`/frontend`):** Cliente web ligero construido con tecnologías nativas (**HTML5, CSS3 y Vanilla JS**), garantizando velocidad de carga y eliminando la dependencia de frameworks JS complejos.
* **Infraestructura (`Docker`):** Contenerización total mediante **Docker** y **Docker Compose** para orquestar la base de datos, el servidor API y el servidor web en cualquier entorno.

---

## Roles y Permisos

El sistema cuenta con un modelo de Control de Acceso Basado en Roles (RBAC):

1. **Root (Superadministrador)**
   * Control total sobre el sistema.
   * Creación, modificación y eliminación de usuarios y asignación de roles.
   * Acceso a logs globales de auditoría y configuración general del sistema.

2. **Administrativo**
   * Gestión operativa del catálogo (altas, bajas y modificaciones de productos y categorías).
   * Generación y exportación de reportes de inventario y movimientos.
   * Gestión de proveedores y visualización de alertas de stock mínimo.

3. **Usuario (Operador)**
   * Consulta de inventario y catálogo disponible en tiempo real.
   * Registro de entradas y salidas de productos (movimientos).
   * Visualización del historial básico de operaciones propias.

---

## Requisitos Previos

Asegúrate de contar con los siguientes elementos instalados en tu sistema:

* [Git](https://git-scm.com/) (v2.x o superior)
* [Docker Engine](https://www.docker.com/) (v20.x o superior)
* [Docker Compose](https://docs.docker.com/compose/) (v2.x o superior)

---

## Instalación y Configuración Local

Sigue los pasos a continuación para clonar y ejecutar el proyecto en tu entorno local:

### 1. Clonar el repositorio
```bash
git clone [https://github.com/tu-usuario/nombre-del-repositorio.git](https://github.com/tu-usuario/nombre-del-repositorio.git)
cd nombre-del-repositorio
