package com.academiagondor.repository;

import com.academiagondor.model.Punto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PuntoRepository extends JpaRepository<Punto, Long> {
    List<Punto> findByAlumnoId(Long alumnoId);
    List<Punto> findByAlumnoIdOrderByFechaOperacionDesc(Long alumnoId);
}
