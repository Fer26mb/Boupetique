<div align="center">

# 📅  Tareas 8 y 9 (Sprint 5)

### 📦 Tarea 8: Formulario de Creación de objeto del modelo (Publicación o Producto)
Desarrollo e integración del módulo para dar de alta nuevos productos en el catálogo utilizando localStorage y validación en el lado del cliente.
* **`producto.html`**: Interfaz para la visualización del catálogo de productos.
* **`json.js`**: Carga de la estructura de datos base e inventario inicial.
* **`productos.js`**: Renderizado e interacción con las tarjetas del catálogo.
* **`registro_prod.html`**: Formulario interactivo para la captura de nuevos productos.
* **`crud.js`**: Lógica del módulo (cálculo de ID, restricciones numéricas, validaciones y guardado en `localStorage`).

Para garantizar una experiencia de usuario y evitar envíos con datos erróneos, se implementó:

Validación Individual por Campo (.was-validated y .invalid-feedback):
Al procesar el evento submit en crud.js, se invoca formEl.checkValidity(). Si la validación no pasa, se añade la clase .was-validated al formulario.
Esto activa los estilos visuales de Bootstrap: ilumina en rojo los bordes de los campos vacíos o inválidos y muestra el mensaje de error.

Confirmación de Éxito (bootstrap.Modal):
Una vez superadas todas las validaciones, los datos se guardan en localStorage y JavaScript activa una ventana modal (#successModal) que notifica al usuario el registro exitoso antes de reiniciar el formulario.


### 📦 Tarea 9: Registro de Usuarios (registro.html)
Formulario de Registro: Implementado en registro.html con Bootstrap, incluyendo los campos de Nombre completo, Teléfono, Email y Contraseña.

* **`registro.html`**: Vista que contiene el formulario de registro de cuenta de usuario.
* **`scriptRegis.js`**: Procesa los registros del formulario, valida la información del usuario y gestiona las respuestas en pantalla.
* **`app.js`**:  Script de integración global para coordinar eventos y componentes de la interfaz.

--------------

# 🐾✨ Boupetique ✨🐾

### 🐶 E-Commerce de Cuidado y Bienestar Animal · Generation México · Cohorte 71

<p>
  <img src="https://img.shields.io/badge/Generation%20México-Cohorte%2071-ff69b4?style=for-the-badge" alt="Generation México">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white" alt="Bootstrap">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java">
  <img src="https://img.shields.io/badge/Spring--Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot">
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL">
</p>

<br>

> **Amor, salud y bienestar integral en cada etapa de su vida. 🐶🐱💖**

<p>
  <em>
    Plataforma E-Commerce especializada en productos certificados para la salud, nutrición 
    y calidad de vida de las mascotas, desarrollada como Proyecto Integrador por el equipo <strong>Piwibabys</strong> en Generation México.
  </em>
</p>

</div>

---

## 🐶 ¿Qué es Boupetique?

**Boupetique** es un canal de e-commerce unificado y confiable diseñado para responder a la creciente "humanización" de las mascotas. Surge ante la problemática de un mercado fragmentado donde encontrar productos certificados, naturales y adecuados según las necesidades específicas de cada compañero (edad, tamaño, raza, condición de salud) resulta complejo.

Ofrecemos una selección curada de:
* 🦴 **Alimento Premium y Nutrición Especializada**
* 💊 **Suplementos y Cuidado Preventivo**
* 🦮 **Accesorios Funcionales y Arneses Anatómicos**
* 🧠 **Juguetes de Enriquecimiento Ambiental y Estimulación**
* 🧼 **Higiene y Grooming Dermatológico**
* 📦 **Suscripciones "Pet Box" y Kits Personalizados**

---

## 🎯 Público Objetivo

Adultos jóvenes y familias jóvenes (**Millennials y Gen Z**) de zonas urbanas, tutores de perros y gatos de nivel socioeconómico medio, medio-alto y alto. Son consumidores informados que consideran a sus mascotas como miembros clave de la familia, priorizan su bienestar integral (nutrición, salud, comodidad) y buscan una experiencia de compra transparente con fichas técnicas detalladas e ingredientes de alta calidad.

---

## 🌟 Misión, Visión y Valores

### 🎯 Misión
Convertirnos en una tienda en línea referente en productos para el cuidado y bienestar de las mascotas, reconocida por ofrecer una selección curada de alimentos, suplementos, accesorios y artículos de calidad que mejoren tangiblemente la salud y felicidad de cada mascota, combinando confianza y asesoría experta.

### 👁️ Visión
Ser la plataforma de e-commerce líder a nivel nacional en productos para el bienestar y calidad de vida de las mascotas, destacando por la trazabilidad de nuestros productos, asesoría personalizada y compromiso con el cuidado responsable y sustentable.

### 💎 Valores
* **Transparencia y honestidad:** Claridad total sobre ingredientes, composición nutricional, certificaciones y precios.
* **Compromiso con el bienestar animal e innovación:** Selección rigurosa respaldada por un diseño web interactivo.
* **Orientación al cliente:** Navegación intuitiva, compras fluidas y entregas puntuales.
* **Desarrollo sustentable y ecológico:** Alianzas locales, productos con menor impacto ambiental y prácticas *cruelty-free*.

---

# 💼 Modelo de Negocio y Propuesta de Valor

Modelo **B2C (Business-to-Consumer)** basado en:
1. **Venta Directa por Catálogo Digital:** Fichas técnicas en HD con detalle nutricional, alérgenos y guía por edad/raza.
2. **Suscripción "Pet Box":** Envíos periódicos (mensual/bimestral) con descuentos por recurrencia.
3. **Kits Personalizados:** Formulario interactivo para armar combos según etapa de vida o dieta.
4. **Programa de Lealtad:** Acumulación de puntos canjeables por saldo.
5. **Publicidad No Intrusiva:** Banners éticos y relevantes para mantener una UX limpia.

### 📊 Análisis Competitivo

| Criterio / Variable | Boupetique (E-commerce) | Supermercados Online | Tiendas / Veterinarias | Marketplaces Generalistas |
|---|---|---|---|---|
| **Transparencia Nutricional (HD)** | **Especializado:** Detalle en ingredientes, alérgenos y edad. | **Baja:** Información básica o imágenes genéricas. | **Variable:** Depende del personal de atención. | **Inconsistente:** Depende de cada vendedor. |
| **Suscripción "Pet Box"** | **Sí:** Mensual/bimestral con descuento y perfil de mascota. | **No:** Compras únicamente manuales. | **No:** Requiere acudir físicamente. | **Limitada:** Disponible en pocos productos. |
| **Kits Personalizados** | **Sí:** Configuración mediante formulario interactivo. | **No:** Venta individual únicamente. | **Raro:** Empaquetados estáticos. | **No:** Combos no personalizados. |
| **Programa de Lealtad** | **Sí:** Puntos acumulables canjeables por saldo. | **Raro:** Puntos generales de tienda externa. | **No:** Tarjetas de papel o inexistente. | **No:** Membresías de envío, no de puntos. |
| **UX No Intrusiva** | **Sí:** Banners relevantes y entorno limpio. | **Baja:** Banners masivos multicategoría. | **N/A** | **Alta saturación:** Publicidad invasiva. |

---

# 🛠️ Tecnologías y Ventajas

<div align="center">

| Área | Tecnología | Descripción / Ventajas |
|---|---|---|
| **Frontend** | HTML5 (Semántico) | Estructura clara que mejora accesibilidad y posicionamiento SEO. |
| **Frontend** | CSS3 / Bootstrap 5 | Diseño modular, responsivo y aceleración en maquetación UI. |
| **Frontend** | JavaScript (ES6+) | Lógica de cliente, interactividad fluida y validaciones sintácticas. |
| **Backend** | Java | Robustez, tipado fuerte y alto rendimiento para procesamiento transaccional. |
| **Backend** | Spring Boot | Creación ágil de APIs RESTful, seguridad e inyección de dependencias. |
| **Base de Datos** | MySQL | Base de datos relacional para gestión estructurada de usuarios, stock y pedidos. |
| **Pruebas/Herramientas**| Postman | Inspección, prueba y validación de Endpoints HTTP. |
| **Control de Versiones**| Git / GitHub | Control de versiones colaborativo y gestión de ramas (*Gitflow*). |
| **Despliegue** | AWS | Infraestructura en la nube para disponibilidad, escalabilidad y rendimiento público. |

</div>

---

# 🏗️ Arquitectura del Sistema

```text
                           🐾 Boupetique
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
              🎨 FRONTEND                  ☕ BACKEND
        (HTML5, Bootstrap, JS)              (Spring Boot)
                    │                           │
                    └─────────────┬─────────────┘
                                  │
                          🗄️ BASE DE DATOS
                             (MySQL)
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
                 👤 Usuarios   🐾 Productos   🛒 Pedidos
```

---

# 📂 Estructura del Repositorio

```text
Boupetique /
│
├── 📁 frontend/
│   ├── 📁 css/
│   │   └── styles.css
│   ├── 📁 js/
│   │   └── app.js
│   ├── 📁 img/
│   ├── index.html
│   ├── productos.html
│   ├── detalle-producto.html
│   ├── acerca.html
│   ├── contacto.html
│   ├── login.html
│   └── registro.html
│
├── 📁 backend/
│   └── 📁 src/
│       └── 📁 main/
│           ├── 📁 java/com/boupetique/
│           └── 📁 resources/
│
├── 📄 README.md
└── 📄 .gitignore
```

---

# 🗺️ Mapa de Navegación (Módulos de la Plataforma)

```text
                  🏠 HOME (Página Principal)
                             │
     ┌───────────────────────┼───────────────────────┐
     ▼                       ▼                       ▼
🦴 PRODUCTOS           👤 MI CUENTA            📬 CONTACTO
     │                       │                       │
     ├─► Lista/Filtros       ├─► Registro            └─► Formulario
     ├─► Detalle             ├─► Login                   Mapa embebido
     └─► Carrito/Checkout    └─► Perfil & Mascotas
                             │
                             ├─► 📦 Mis Pedidos
                             ├─► 🎁 Pet Box / Kits
                             ├─► ⚙️ Admin Panel
                             ├─► 📖 Blog / Cuidado
                             └─► ⭐ Reseñas
```

| # | Página / Módulo | Descripción y Contenidos Clave |
|---|---|---|
| **1** | **Página Principal (Inicio)** | Banner con promociones, carrusel de destacados, carrusel de testimonios, FAQs y CTA a Kits Personalizados. |
| **2** | **Contáctenos** | Formulario de contacto validado con JS, mapa interactivo embebido y datos de atención directa. |
| **3** | **Acerca de Nosotros** | Historia, filosofía de cuidado animal, misión, visión y contador animado de mascotas beneficiadas. |
| **4** | **Registro / Mi Perfil** | CRUD completo de Usuario y datos de mascotas (especie, raza, edad) para recomendaciones a medida. |
| **5** | **Login** | Formulario de acceso validado con JS y redirección a registro de usuarios. |
| **6** | **Lista de Productos** | Filtros por categoría y especie, grid interactivo de tarjetas y consumo de API. |
| **7-8**| **Carrito & Checkout** | Selección de cantidad, sugerencias cruzadas, cálculo de envío, simulación de pago y confirmación. |
| **9** | **Mis Pedidos** | Historial de compras, estado del paquete (pendiente/entregado) y formulario de calificación. |
| **10**| **Pedidos Especiales (Pet Box)** | Configuración interactiva de kits y suscripciones periódicas personalizadas. |
| **11**| **Panel Administrativo** | Gestión interna de catálogo, stock, estado de pedidos y usuarios. |
| **12**| **Blog Cuidado Animal** | Consejos de nutrición, enriquecimiento ambiental y guías de salud por especie. |
| **13**| **Reseñas Verificadas** | Módulo de opiniones reales con fotos de mascotas y sistema de estrellas. |

---

# 📅 Planificación de Sprints (Cronograma Scrum)

Las sesiones *Daily* se ejecutan los días **Lunes y Jueves**.

| Sprint | Periodo (2026) | Entregables e Hitos Principales |
|---|---|---|
| **Sprint 1** | 31 Aug - 06 Sep | Documento de definición, repositorio GitHub, tablero Jira, Backlog y Avance 1. |
| **Sprint 2** | 07 Sep - 13 Sep | Tareas 3 y 4, Guía de diseño/estilos y Maquetación "Sobre Nosotros". |
| **Sprint 3** | 14 Sep - 20 Sep | Tareas 5 y 6, Página "Contáctanos", Navegación (NavBar) y Presentación 1. |
| **Sprint 4** | 21 Sep - 27 Sep | Tarea 7, Listado y maquetación de modelos de productos. |
| **Sprint 5** | 28 Sep - 04 Oct | Tareas 8 y 9, Formulario de creación de productos, "Registro de Usuarios" y ajustes Front-End. |
| **Sprint 6** | 05 Oct - 11 Oct | Tareas 10 y 11, Login con LocalStorage, diseño de BD en MySQL y maquetación Front-End preliminar. |
| **Sprint 7** | 12 Oct - 18 Oct | Tareas 12 y 13, Inicialización de Spring Boot API REST, Services y Controllers. |
| **Sprint 8** | 19 Oct - 25 Oct | Tareas 14 y 15, Integración Spring Boot + FrontEnd, Despliegue en AWS y Presentación Final. |

---

# 🧪 Plan de Pruebas

| Fase | Tipo de Prueba | Módulo / Sección | Descripción del Enfoque |
|---|---|---|---|
| **Frontend** | Responsive Design | Todas las vistas | Adaptabilidad visual en móviles, tablets y monitores. |
| **Frontend** | Botones Funcionales | Login, Registro, Carrito | Confirmación de eventos de clic y navegación correcta. |
| **Frontend** | Validación de Datos | Formularios | Verificación sintáctica de correo, contraseña y campos requeridos en JS. |
| **Base de Datos**| Operaciones CRUD | Usuarios, Productos, Pedidos | Verificación de Inserción, Edición, Búsqueda y Borrado seguro en MySQL. |
| **Backend** | Endpoints & Excepciones| API REST (Spring Boot) | Validación de códigos HTTP, manejo de errores y lógica de negocio en Postman. |
| **Conexiones** | Deploy Integración | Servidor Cloud (AWS) | Prueba de conexión integral pública (Frontend ↔ Backend ↔ Base de Datos). |

---

# 👨‍💻 Equipo de Desarrollo: Piwibabys

| Integrante | Rol en Desarrollo | Confirmación / Estado |
|---|---|:---:|
| **Aldaco Dominguez, Gerardo Sebastian** | Full Stack Developer / Scrum Master / PO | 🔥 Confirmado |
| **Alvarez Alvarez, Eduardo** | Full Stack Developer | 🫰 Confirmado |
| **Blanco Monzón, Christopher** | Full Stack Developer / Scrum Master | ⚡ Confirmado |
| **Carrizosa Carrizosa, Andres Cornelio** | Full Stack Developer / Product Owner | 👌 Confirmado |
| **Jimenez Copeño, Dayana Ailed** | Full Stack Developer / Scrum Master | 🌟 Confirmado |
| **Jimenez Navarro, Edith Fernanda** | Full Stack Developer / Product Owner | 🆗 Confirmado |
| **Lamas Montes, Zaira Jahdai** | Full Stack Developer / Scrum Master / PO | ⭐ Confirmado |
| **Olan Flores, Jose Eduardo** | Full Stack Developer / Scrum Master / PO | 🤟 Confirmado |
| **Torres González, Lizbeth** | Full Stack Developer / Product Owner | 🌸 Confirmado |
| **Velázquez Rayón, Jaime Alexis** | Full Stack Developer / Scrum Master | 👍 Confirmado |

---

# 🔄 Matriz de Rotación de Roles (Scrum Master & PO)

| Semanas | Product Owner (PO) | Scrum Master (SM) |
|---|---|---|
| **Semanas 6 y 7** | Zaira, Lizbeth, Sebastian | Sebastian, Christopher |
| **Semanas 8 y 9** | Christopher, Dayana, Eduardo | Jaime, Jose Eduardo |
| **Semanas 10 y 11** | Edith Fernanda, Jaime | Zaira, Dayana |
| **Semanas 12 y 13** | Andres, Jose Eduardo | Lizbeth, Andres |

---

# 🎓 Proyecto Integrador

<div align="center">

### 🇲🇽 Generation México · Cohorte 71

**Equipo Piwibabys — Full Stack Java Web Developer**

**Boupetique 🐾**

---

> _"El código también puede transformar la salud y felicidad de quienes nos regalan su amor incondicional."_ 🐶🐱💻

<br>

**Made with ❤️ by Equipo Piwibabys — Generation México**

</div>
