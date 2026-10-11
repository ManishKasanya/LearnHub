package com.learnhub.config;

import com.learnhub.security.JwtAuthenticationEntryPoint;
import com.learnhub.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationEntryPoint unauthorizedHandler;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationEntryPoint unauthorizedHandler, JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.unauthorizedHandler = unauthorizedHandler;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:5173",
                "http://localhost:3000",
                "http://127.0.0.1:5173",
                "http://127.0.0.1:3000"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With", "Accept"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable))
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                        .requestMatchers(
                                "/api/health/**",
                                "/api/auth/**",
                                "/api/categories/**",
                                "/api/certificates/verify/**",
                                "/api/transactions/config",
                                "/uploads/**",
                                "/h2-console/**",
                                "/error"
                        ).permitAll()
                        // Public course browsing
                        .requestMatchers(HttpMethod.GET, "/api/courses/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/reviews/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/live-classes").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/live-classes/{id}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/live-classes/course/**").permitAll()
                        // Admin restricted endpoints
                        .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers("/api/transactions/admin/**").hasAuthority("ROLE_ADMIN")
                        // Instructor restricted endpoints
                        .requestMatchers(HttpMethod.POST, "/api/courses/**").hasAnyAuthority("ROLE_INSTRUCTOR", "ROLE_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/courses/**").hasAnyAuthority("ROLE_INSTRUCTOR", "ROLE_ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/courses/**").hasAnyAuthority("ROLE_INSTRUCTOR", "ROLE_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/courses/**").hasAnyAuthority("ROLE_INSTRUCTOR", "ROLE_ADMIN")
                        .requestMatchers("/api/live-classes/instructor/**").hasAnyAuthority("ROLE_INSTRUCTOR", "ROLE_ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/live-classes/**").hasAnyAuthority("ROLE_INSTRUCTOR", "ROLE_ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/live-classes/**").hasAnyAuthority("ROLE_INSTRUCTOR", "ROLE_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/live-classes/**").hasAnyAuthority("ROLE_INSTRUCTOR", "ROLE_ADMIN")
                        // All other endpoints require authentication
                        .anyRequest().authenticated()
                );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
