package com.example.companieslist.controller;

import com.example.companieslist.dto.EmployeeDto;
import com.example.companieslist.exception.ResourceNotFoundException;
import com.example.companieslist.model.Employee;
import com.example.companieslist.model.Enterprise;
import com.example.companieslist.repository.EmployeeRepository;
import com.example.companieslist.repository.EnterpriseRepository;
import com.example.companieslist.service.ExcelGenerator;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private EnterpriseRepository enterpriseRepository;


    @GetMapping
    public List<EmployeeDto> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(this::convertToEmployeeDto)
                .collect(Collectors.toList());
    }

    private EmployeeDto convertToEmployeeDto(Employee employee) {
        EmployeeDto employeeDto = new EmployeeDto();
        employeeDto.setId(employee.getId());
        employeeDto.setFirstName(employee.getFirstName());
        employeeDto.setLastName(employee.getLastName());
        employeeDto.setPost(employee.getPost());
        employeeDto.setEnterpriseId(employee.getEnterprise().getId());
        return employeeDto;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        Optional<Employee> employee = employeeRepository.findById(id);
        return employee.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Employee createEmployee(@RequestBody EmployeeDto employeeDto) {
        Optional<Enterprise> enterprise = enterpriseRepository.findById(employeeDto.getEnterpriseId());
        if (enterprise.isPresent()) {
            Employee employee = new Employee();
            employee.setFirstName(employeeDto.getFirstName());
            employee.setLastName(employeeDto.getLastName());
            employee.setPost(employeeDto.getPost());
            employee.setEnterprise(enterprise.get());
            return employeeRepository.save(employee);
        } else {
            throw new ResourceNotFoundException("Enterprise not found with id: " + employeeDto.getEnterpriseId());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @RequestBody EmployeeDto updatedEmployeeDto) {
        Optional<Employee> employee = employeeRepository.findById(id);
        if (employee.isPresent()) {
            Employee existingEmployee = employee.get();
            existingEmployee.setFirstName(updatedEmployeeDto.getFirstName());
            existingEmployee.setLastName(updatedEmployeeDto.getLastName());
            existingEmployee.setPost(updatedEmployeeDto.getPost());

            // Установите enterprise для существующего сотрудника, используя EnterpriseRepository
            Optional<Enterprise> enterprise = enterpriseRepository.findById(updatedEmployeeDto.getEnterpriseId());
            if (enterprise.isPresent()) {
                existingEmployee.setEnterprise(enterprise.get());
            } else {
                throw new ResourceNotFoundException("Enterprise not found with id: " + updatedEmployeeDto.getEnterpriseId());
            }

            return ResponseEntity.ok(employeeRepository.save(existingEmployee));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        Optional<Employee> employee = employeeRepository.findById(id);
        if (employee.isPresent()) {
            employeeRepository.delete(employee.get());
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Получить всех сотрудников для конкретного предприятия
    @GetMapping("/enterprises/{enterpriseId}/employees")
    public List<Employee> getEmployeesByEnterpriseId(@PathVariable Long enterpriseId) {
        return employeeRepository.findAllByEnterpriseId(enterpriseId);
    }

    @GetMapping(value = "/report/{enterpriseId}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public void exportIntoExcelFile(@PathVariable Long enterpriseId, HttpServletResponse response) throws IOException {
        response.setContentType("application/octet-stream");
        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss");
        String currentDateTime = dateFormatter.format(new Date());

        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=employees-" + currentDateTime + ".xlsx";
        response.setHeader(headerKey, headerValue);

        List<Employee> listOfEmployees = employeeRepository.findAllByEnterpriseId(enterpriseId);

        if (listOfEmployees.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return; // Выходим из метода
        }

        ExcelGenerator generator = new ExcelGenerator(listOfEmployees);
        generator.generateExcelFile(response);
    }

}
