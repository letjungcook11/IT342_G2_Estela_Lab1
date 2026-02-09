package IT342_G2_Estela_LAB1;

import org.springframework.boot.convert.DataSizeUnit;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
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

    @Column (nullable = false)
    private String password;

}