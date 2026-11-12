package com.veriwork;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Điểm khởi chạy của VeriWork (Spring Boot).
 *
 * Spring Boot tự động phục vụ các file tĩnh đặt trong:
 *   src/main/resources/static/
 *     ├── index.html   (mở tại http://localhost:8080/)
 *     ├── styles.css
 *     └── app.js
 *
 * File này đặt tại: src/main/java/com/veriwork/VeriWorkApplication.java
 */
@SpringBootApplication
public class VeriWorkApplication {

    public static void main(String[] args) {
        SpringApplication.run(VeriWorkApplication.class, args);
    }
}
