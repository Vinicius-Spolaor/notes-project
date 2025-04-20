package com.ensolvers.challenge.component;

import com.ensolvers.challenge.entity.User;
import com.ensolvers.challenge.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class DatabaseInitializer implements ApplicationRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (userRepository.count() == 0) {
            var defaultUser = User.builder().username("user").password(passwordEncoder.encode("user")).build();
            userRepository.save(defaultUser);

            log.info("Default user 'user' created with password 'user'");
        }
    }
}
