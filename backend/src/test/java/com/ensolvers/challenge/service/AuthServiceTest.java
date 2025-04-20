package com.ensolvers.challenge.service;

import com.ensolvers.challenge.dto.LoginRequestDTO;
import com.ensolvers.challenge.entity.User;
import com.ensolvers.challenge.repository.UserRepository;
import com.ensolvers.challenge.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuthService authService;

    @Test
    void loginShouldReturnToken() {
        var request = LoginRequestDTO.builder().username("testuser").password("password").build();
        var user = User.builder().id(1L).username("testuser").build();

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(jwtService.generateToken(user)).thenReturn("mocked-token");

        var response = authService.login(request);

        assertNotNull(response);
        assertEquals("mocked-token", response.getAccessToken());
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }
}
