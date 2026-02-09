package com.it342.backend.model;

import org.springframework.boot.convert.DataSizeUnit;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class User{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column (nullable = false,  unique = true)
    private String email;

    @Column (nullable = false)
    private String username;

    @JsonIgnore
    @Column (nullable = false)
    private String password;

}