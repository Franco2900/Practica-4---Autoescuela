-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 03-12-2025 a las 21:57:27
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `thisisthewaydb`
--
CREATE DATABASE IF NOT EXISTS `thisisthewaydb` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `thisisthewaydb`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clase`
--

DROP TABLE IF EXISTS `clase`;
CREATE TABLE `clase` (
  `id` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora_desde` time NOT NULL,
  `hora_hasta` time NOT NULL,
  `numero` tinyint(4) UNSIGNED NOT NULL,
  `recordatorioEnviado` tinyint(1) NOT NULL DEFAULT 0,
  `estudiante_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clase`
--

INSERT INTO `clase` (`id`, `fecha`, `hora_desde`, `hora_hasta`, `numero`, `recordatorioEnviado`, `estudiante_id`) VALUES
(104, '2025-09-29', '09:00:00', '10:00:00', 1, 0, 42),
(105, '2025-09-30', '16:30:00', '17:30:00', 1, 0, 43),
(106, '2025-10-03', '11:00:00', '12:00:00', 1, 0, 44),
(107, '2025-10-04', '09:00:00', '10:00:00', 1, 0, 45),
(108, '2025-10-04', '10:00:00', '11:00:00', 1, 0, 46),
(109, '2025-10-04', '11:00:00', '12:00:00', 1, 0, 47),
(110, '2025-10-05', '09:00:00', '10:00:00', 1, 0, 48),
(111, '2025-10-05', '10:00:00', '11:00:00', 1, 0, 49),
(112, '2025-10-05', '11:00:00', '12:00:00', 1, 0, 50),
(113, '2025-10-06', '09:00:00', '10:00:00', 1, 0, 51),
(114, '2025-10-06', '10:00:00', '11:00:00', 2, 0, 42),
(115, '2025-10-07', '09:00:00', '10:00:00', 2, 0, 43),
(116, '2025-10-07', '10:00:00', '11:00:00', 2, 0, 44),
(117, '2025-10-08', '09:00:00', '10:00:00', 2, 0, 45),
(118, '2025-10-08', '10:00:00', '11:00:00', 2, 0, 46),
(119, '2025-10-09', '09:00:00', '10:00:00', 2, 0, 47),
(120, '2025-10-09', '10:00:00', '11:00:00', 2, 0, 48),
(121, '2025-10-10', '09:00:00', '10:00:00', 2, 0, 49),
(122, '2025-10-10', '10:00:00', '11:00:00', 2, 0, 50),
(123, '2025-10-11', '09:00:00', '10:00:00', 2, 0, 51),
(124, '2025-10-11', '10:00:00', '11:00:00', 3, 0, 42),
(125, '2025-10-12', '09:00:00', '10:00:00', 3, 0, 43),
(126, '2025-10-12', '10:00:00', '11:00:00', 3, 0, 44),
(127, '2025-10-14', '15:00:00', '16:00:00', 4, 0, 43),
(128, '2025-10-17', '15:30:00', '16:30:00', 3, 0, 50),
(131, '2025-12-02', '14:00:00', '15:00:00', 4, 0, 50),
(132, '2025-12-03', '18:00:00', '18:30:00', 4, 1, 44);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estudiante`
--

DROP TABLE IF EXISTS `estudiante`;
CREATE TABLE `estudiante` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `direccion` varchar(50) NOT NULL,
  `celular` varchar(20) NOT NULL,
  `nacionalidad` varchar(50) NOT NULL,
  `dni` varchar(50) NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `notas` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estudiante`
--

INSERT INTO `estudiante` (`id`, `nombre`, `apellido`, `direccion`, `celular`, `nacionalidad`, `dni`, `email`, `notas`) VALUES
(42, 'Martín', 'González', 'Av. Rivadavia 1234, CABA', '+54-9-11-1234-5678', 'Argentina', '12.345.678', '', ''),
(43, 'Lucía', 'Fernández', 'Calle Mitre 45, Quilmes', '+54-11-2345-6789', 'Argentina', '23.456.789', '', ''),
(44, 'Sofía', 'Pérez', 'Paso 678, Lomas de Zamora', '+54-9-11-9876-5432', 'Argentina', '34.567.890', '', ''),
(45, 'Diego', 'Ramírez', 'Av. Hipólito Yrigoyen 200, Claypole', '+54-11-4444-3333', 'Argentina', '45.678.901', '', ''),
(46, 'Valentina', 'López', 'Cnel. Díaz 250, Banfield', '+54-9-11-5555-6666', 'Argentina', '56.789.012', '', ''),
(47, 'Federico', 'Martínez', 'Calle Sarmiento 890, Adrogué', '+54-11-7777-8888', 'Argentina', '67.890.123', '', ''),
(48, 'María', 'García', 'Av. San Martín 101, Banfield', '+54-9-11-2222-1111', 'Argentina', '78.901.234', '', ''),
(49, 'Tomás', 'Rodríguez', 'Belgrano 56, Temperley', '+54-11-6666-7777', 'Argentina', '89.012.345', '', ''),
(50, 'Camila', 'Sosa', 'Italia 34, Burzaco', '+54-9-11-3333-2222', 'Argentina', '90.123.456', '', ''),
(51, 'Nicolás', 'Vargas', 'Av. Brown 150, Longchamps', '+54-11-9999-0000', 'Argentina', '01.234.567', '', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evento`
--

DROP TABLE IF EXISTS `evento`;
CREATE TABLE `evento` (
  `id` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora_desde` time NOT NULL,
  `hora_hasta` time NOT NULL,
  `descripcion` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `evento`
--

INSERT INTO `evento` (`id`, `fecha`, `hora_desde`, `hora_hasta`, `descripcion`) VALUES
(1, '2025-10-04', '15:00:00', '16:30:00', 'Auto en taller mecanico'),
(2, '2025-12-02', '15:15:00', '16:45:00', 'Auto revision');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pago`
--

DROP TABLE IF EXISTS `pago`;
CREATE TABLE `pago` (
  `id` int(11) NOT NULL,
  `cantidad_pagada` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `numero` tinyint(4) NOT NULL,
  `estudiante_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pago`
--

INSERT INTO `pago` (`id`, `cantidad_pagada`, `fecha`, `hora`, `numero`, `estudiante_id`) VALUES
(35, 5000, '2025-10-03', '09:15:00', 1, 42),
(36, 5000, '2025-10-03', '10:30:00', 1, 43),
(37, 6000, '2025-10-04', '11:00:00', 1, 44),
(38, 4500, '2025-10-05', '09:45:00', 1, 45),
(39, 4500, '2025-10-05', '10:45:00', 1, 46),
(40, 7000, '2025-10-06', '14:00:00', 1, 47),
(41, 5000, '2025-10-07', '16:15:00', 1, 48),
(42, 5000, '2025-10-08', '09:00:00', 1, 49),
(43, 5000, '2025-10-08', '10:00:00', 1, 50),
(44, 5000, '2025-10-09', '11:30:00', 1, 51),
(45, 5000, '2025-10-10', '09:20:00', 2, 42),
(46, 5000, '2025-10-10', '10:40:00', 2, 43),
(47, 6000, '2025-10-11', '11:10:00', 2, 44),
(48, 4500, '2025-10-11', '12:00:00', 2, 45),
(49, 7000, '2025-10-12', '15:30:00', 2, 47);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

DROP TABLE IF EXISTS `usuario`;
CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `contrasenia` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `nombre`, `contrasenia`) VALUES
(1, 'admin', '1234');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `clase`
--
ALTER TABLE `clase`
  ADD PRIMARY KEY (`id`),
  ADD KEY `estudiante_ID` (`estudiante_id`);

--
-- Indices de la tabla `estudiante`
--
ALTER TABLE `estudiante`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `evento`
--
ALTER TABLE `evento`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pago`
--
ALTER TABLE `pago`
  ADD PRIMARY KEY (`id`),
  ADD KEY `estudiante_id` (`estudiante_id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `clase`
--
ALTER TABLE `clase`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=133;

--
-- AUTO_INCREMENT de la tabla `estudiante`
--
ALTER TABLE `estudiante`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT de la tabla `evento`
--
ALTER TABLE `evento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `pago`
--
ALTER TABLE `pago`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `clase`
--
ALTER TABLE `clase`
  ADD CONSTRAINT `clase_ibfk_1` FOREIGN KEY (`estudiante_ID`) REFERENCES `estudiante` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `clase_ibfk_2` FOREIGN KEY (`estudiante_id`) REFERENCES `estudiante` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `pago`
--
ALTER TABLE `pago`
  ADD CONSTRAINT `pago_ibfk_1` FOREIGN KEY (`estudiante_id`) REFERENCES `estudiante` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
