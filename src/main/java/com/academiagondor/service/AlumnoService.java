package com.academiagondor.service;

import com.academiagondor.model.Alumno;
import com.academiagondor.model.Punto;
import com.academiagondor.repository.AlumnoRepository;
import com.academiagondor.repository.PuntoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class AlumnoService {
    
    @Autowired
    private AlumnoRepository alumnoRepository;
    
    @Autowired
    private PuntoRepository puntoRepository;
    
    public List<Alumno> obtenerTodosAlumnos() {
        return alumnoRepository.findAll();
    }
    
    public List<Alumno> obtenerRanking() {
        return alumnoRepository.findAllByOrderByPuntosDesc();
    }
    
    public Optional<Alumno> obtenerAlumnoPorId(Long id) {
        return alumnoRepository.findById(id);
    }
    
    public List<Alumno> obtenerAlumnosPorGenero(String genero) {
        return alumnoRepository.findByGenero(genero);
    }
    
    public Alumno crearAlumno(Alumno alumno) {
        if (alumnoRepository.count() >= 21) {
            throw new RuntimeException("No se pueden agregar más de 21 alumnos");
        }
        alumno.setPuntos(0);
        return alumnoRepository.save(alumno);
    }
    
    public Alumno actualizarAlumno(Long id, Alumno alumnoActualizado) {
        Optional<Alumno> alumnoOpt = alumnoRepository.findById(id);
        if (alumnoOpt.isPresent()) {
            Alumno alumno = alumnoOpt.get();
            alumno.setNombre(alumnoActualizado.getNombre());
            alumno.setGenero(alumnoActualizado.getGenero());
            if (alumnoActualizado.getUrlFoto() != null) {
                alumno.setUrlFoto(alumnoActualizado.getUrlFoto());
            }
            return alumnoRepository.save(alumno);
        }
        throw new RuntimeException("Alumno no encontrado");
    }
    
    @Transactional
    public Alumno agregarPuntos(Long id, Integer cantidad, String razon) {
        Optional<Alumno> alumnoOpt = alumnoRepository.findById(id);
        if (alumnoOpt.isPresent()) {
            Alumno alumno = alumnoOpt.get();
            alumno.setPuntos(alumno.getPuntos() + cantidad);
            
            Punto punto = new Punto();
            punto.setAlumno(alumno);
            punto.setCantidad(cantidad);
            punto.setTipoOperacion("suma");
            punto.setRazon(razon);
            
            puntoRepository.save(punto);
            return alumnoRepository.save(alumno);
        }
        throw new RuntimeException("Alumno no encontrado");
    }
    
    @Transactional
    public Alumno restarPuntos(Long id, Integer cantidad, String razon) {
        Optional<Alumno> alumnoOpt = alumnoRepository.findById(id);
        if (alumnoOpt.isPresent()) {
            Alumno alumno = alumnoOpt.get();
            alumno.setPuntos(Math.max(0, alumno.getPuntos() - cantidad));
            
            Punto punto = new Punto();
            punto.setAlumno(alumno);
            punto.setCantidad(cantidad);
            punto.setTipoOperacion("resta");
            punto.setRazon(razon);
            
            puntoRepository.save(punto);
            return alumnoRepository.save(alumno);
        }
        throw new RuntimeException("Alumno no encontrado");
    }
    
    @Transactional
    public Alumno establecerPuntos(Long id, Integer puntosNuevos) {
        Optional<Alumno> alumnoOpt = alumnoRepository.findById(id);
        if (alumnoOpt.isPresent()) {
            Alumno alumno = alumnoOpt.get();
            alumno.setPuntos(puntosNuevos);
            return alumnoRepository.save(alumno);
        }
        throw new RuntimeException("Alumno no encontrado");
    }
    
    public void eliminarAlumno(Long id) {
        alumnoRepository.deleteById(id);
    }
    
    public List<Punto> obtenerHistorialAlumno(Long id) {
        return puntoRepository.findByAlumnoIdOrderByFechaOperacionDesc(id);
    }
}
