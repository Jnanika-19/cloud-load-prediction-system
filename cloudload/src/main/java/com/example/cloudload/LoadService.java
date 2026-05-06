package com.example.cloudload;

import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class LoadService {
    public double predictLoad(List<Double> loads) {

        if (loads == null || loads.isEmpty()) {
            return 0;
        }

        // Simple prediction: average growth
        double sum = 0;
        for (double l : loads) {
            sum += l;
        }

        return sum / loads.size();
    }
}
