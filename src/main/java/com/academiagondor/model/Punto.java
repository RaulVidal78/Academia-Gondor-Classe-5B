package com.academiagondor.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "puntos_historial")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Punto {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "alumno_id", nullable = false)
    private Alumno alumno;
    
    @Column(nullable = false)
    private Integer cantidad;
    
    @Column(name = "tipo_operacion")
    private String tipoOperacion;
    
    @Column(name = "razon")
    private String razon;
    
    @Column(name = "fecha_operacion", nullable = false, updatable = false)
    private LocalDateTime fechaOperacion;
    
    @PrePersist
    protected void onCreate() {
        fechaOperacion = LocalDateTime.now();
    }
}
