package com.academiagondor.service;

import com.academiagondor.model.Alumno;
import com.academiagondor.repository.AlumnoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EstadisticasService {
    
    @Autowired
    private AlumnoRepository alumnoRepository;
    
    public Map<String, Object> obtenerEstadisticas() {
        List<Alumno> alumnos = alumnoRepository.findAll();
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalAlumnos", alumnos.size());
        
        long chicos = alumnos.stream().filter(a -> "chico".equalsIgnoreCase(a.getGenero())).count();
        long chicas = alumnos.stream().filter(a -> "chica".equalsIgnoreCase(a.getGenero())).count();
        
        Map<String, Long> generos = new HashMap<>();
        generos.put("chicos", chicos);
        generos.put("chicas", chicas);
        stats.put("distribucionGenero", generos);
        
        int totalPuntos = alumnos.stream().mapToInt(Alumno::getPuntos).sum();
        stats.put("puntosTotal", totalPuntos);
        
        double promedioPuntos = alumnos.isEmpty() ? 0 : (double) totalPuntos / alumnos.size();
        stats.put("promedioPuntos", promedioPuntos);
        
        return stats;
    }
}
