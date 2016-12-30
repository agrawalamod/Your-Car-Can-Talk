package com.learn2crack.gcmdemo.models;


public class ResponseBody {

    private String timestamp;
    double speed, mileage, fuel_remaining, distance, distance_togo;

    public String getTimestamp() {
        return timestamp;
    }

    public double getSpeed() {
        return speed;
    }

    public double getMileage() {
        return mileage;
    }

    public double getFuel_remaining() {
        return fuel_remaining;
    }

    public double getDistance() {
        return distance;
    }

    public double getDistance_togo() {
        return distance_togo;
    }
}
