package com.example.companieslist.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String post;
    private Long enterpriseId; // ID компании

    // ... конструкторы, геттеры и сеттеры ...
}