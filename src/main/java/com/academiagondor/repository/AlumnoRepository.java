package com.academiagondor.repository;

import com.academiagondor.model.Alumno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AlumnoRepository extends JpaRepository<Alumno, Long> {
    List<Alumno> findByGenero(String genero);
    List<Alumno> findAllByOrderByPuntosDesc();
}
