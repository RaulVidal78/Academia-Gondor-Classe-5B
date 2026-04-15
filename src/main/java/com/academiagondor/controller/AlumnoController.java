package com.academiagondor.controller;

import com.academiagondor.model.Alumno;
import com.academiagondor.model.Punto;
import com.academiagondor.service.AlumnoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alumnos")
@CrossOrigin(origins = "*")
public class AlumnoController {
    
    @Autowired
    private AlumnoService alumnoService;
    
    @GetMapping
    public ResponseEntity<List<Alumno>> obtenerTodosAlumnos() {
        return ResponseEntity.ok(alumnoService.obtenerTodosAlumnos());
    }
    
    @GetMapping("/ranking")
    public ResponseEntity<List<Alumno>> obtenerRanking() {
        return ResponseEntity.ok(alumnoService.obtenerRanking());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Alumno> obtenerAlumnoPorId(@PathVariable Long id) {
        return alumnoService.obtenerAlumnoPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping("/genero/{genero}")
    public ResponseEntity<List<Alumno>> obtenerAlumnosPorGenero(@PathVariable String genero) {
        return ResponseEntity.ok(alumnoService.obtenerAlumnosPorGenero(genero));
    }
    
    @PostMapping
    public ResponseEntity<Alumno> crearAlumno(@RequestBody Alumno alumno) {
        try {
            return ResponseEntity.ok(alumnoService.crearAlumno(alumno));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Alumno> actualizarAlumno(@PathVariable Long id, @RequestBody Alumno alumno) {
        try {
            return ResponseEntity.ok(alumnoService.actualizarAlumno(id, alumno));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/{id}/puntos/agregar")
    public ResponseEntity<Alumno> agregarPuntos(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
            Integer cantidad = ((Number) request.get("cantidad")).intValue();
            String razon = (String) request.get("razon");
            return ResponseEntity.ok(alumnoService.agregarPuntos(id, cantidad, razon));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/{id}/puntos/restar")
    public ResponseEntity<Alumno> restarPuntos(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
            Integer cantidad = ((Number) request.get("cantidad")).intValue();
            String razon = (String) request.get("razon");
            return ResponseEntity.ok(alumnoService.restarPuntos(id, cantidad, razon));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/{id}/puntos/establecer")
    public ResponseEntity<Alumno> establecerPuntos(@PathVariable Long id, @RequestBody Map<String, Integer> request) {
        try {
            Integer puntos = request.get("puntos");
            return ResponseEntity.ok(alumnoService.establecerPuntos(id, puntos));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarAlumno(@PathVariable Long id) {
        alumnoService.eliminarAlumno(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/{id}/historial")
    public ResponseEntity<List<Punto>> obtenerHistorial(@PathVariable Long id) {
        return ResponseEntity.ok(alumnoService.obtenerHistorialAlumno(id));
    }
}
