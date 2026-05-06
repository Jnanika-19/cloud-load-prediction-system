package com.example.cloudload;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoadController {
    @Autowired
    private LoadService service;

    @PostMapping("/predict")
    public double predict(@RequestBody LoadRequest request) {

        List<Double> loads = request.getLoads();

        return service.predictLoad(loads);
    }     
    
}
