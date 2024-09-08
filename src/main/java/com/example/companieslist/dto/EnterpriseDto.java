package com.example.companieslist.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EnterpriseDto {
    private Long id;
    private String name;
    private List<EmployeeDto> employees; // Список ID сотрудников

}
