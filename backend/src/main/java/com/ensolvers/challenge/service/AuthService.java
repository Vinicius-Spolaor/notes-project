package com.ensolvers.challenge.service;

import com.ensolvers.challenge.dto.LoginRequestDTO;
import com.ensolvers.challenge.dto.TokenResponseDTO;
import com.ensolvers.challenge.entity.User;
import com.ensolvers.challenge.exception.BusinessException;
import com.ensolvers.challenge.repository.UserRepository;
import com.ensolvers.challenge.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(AuthenticationManager authenticationManager,
                       JwtService jwtService,
                       UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public TokenResponseDTO login(LoginRequestDTO request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        var user = userRepository.findByUsername(request.getUsername()).orElseThrow(() -> new BusinessException("User not found."));
        var jwt = jwtService.generateToken(user);

        return TokenResponseDTO.builder()
                .accessToken(jwt)
                .tokenType("Bearer")
                .expiresIn(jwtService.getExpirationInSeconds())
                .scope("read write")
                .userId(user.getId())
                .username(user.getUsername())
                .build();
    }

    public void register(LoginRequestDTO request) {
        var user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);
    }
}
