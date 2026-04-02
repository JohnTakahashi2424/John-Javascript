-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 02, 2026 at 07:06 PM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_academica`
--

-- --------------------------------------------------------

--
-- Table structure for table `alumnos`
--

CREATE TABLE `alumnos` (
  `id` int(10) NOT NULL,
  `idAlumno` char(36) NOT NULL,
  `codigo` char(10) NOT NULL,
  `nombre` char(100) NOT NULL,
  `direccion` char(150) NOT NULL,
  `email` char(150) NOT NULL,
  `telefono` char(9) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- --------------------------------------------------------
-- Tabla `docentes`
-- --------------------------------------------------------

CREATE TABLE `docentes` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `idDocente` char(36) NOT NULL,
  `codigo` char(10) NOT NULL,
  `nombre` char(100) NOT NULL,
  `direccion` char(150) NOT NULL,
  `email` char(150) NOT NULL,
  `telefono` char(15) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idDocente` (`idDocente`),
  UNIQUE KEY `codigo_docente` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- --------------------------------------------------------
-- Tabla `materias`
-- --------------------------------------------------------
CREATE TABLE `materias` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `idMateria` char(36) NOT NULL,
  `codigo` char(10) NOT NULL,
  `nombre` char(100) NOT NULL,
  `creditos` int(2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idMateria` (`idMateria`),
  UNIQUE KEY `codigo_materia` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- --------------------------------------------------------
-- Tabla `matriculas`
-- --------------------------------------------------------
CREATE TABLE `matriculas` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `idMatricula` char(36) NOT NULL,
  `alumno_id` int(10) NOT NULL,
  `fecha` date NOT NULL,
  `ciclo` char(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idMatricula` (`idMatricula`),
  KEY `alumno_id` (`alumno_id`),
  CONSTRAINT `fk_matricula_alumno` FOREIGN KEY (`alumno_id`) REFERENCES `alumnos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- --------------------------------------------------------
-- Tabla `inscripciones`
-- --------------------------------------------------------
CREATE TABLE `inscripciones` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `idInscripcion` char(36) NOT NULL,
  `matricula_id` int(10) NOT NULL,
  `materia_id` int(10) NOT NULL,
  `docente_id` int(10) NOT NULL,
  `fecha` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idInscripcion` (`idInscripcion`),
  KEY `matricula_id` (`matricula_id`),
  KEY `materia_id` (`materia_id`),
  KEY `docente_id` (`docente_id`),
  CONSTRAINT `fk_inscripcion_matricula` FOREIGN KEY (`matricula_id`) REFERENCES `matriculas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_inscripcion_materia` FOREIGN KEY (`materia_id`) REFERENCES `materias` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_inscripcion_docente` FOREIGN KEY (`docente_id`) REFERENCES `docentes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `alumnos`
--
ALTER TABLE `alumnos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idAlumno` (`idAlumno`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `alumnos`
--
ALTER TABLE `alumnos`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
