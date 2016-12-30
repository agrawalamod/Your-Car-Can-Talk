package com.learn2crack.gcmdemo;

import android.app.IntentService;
import android.content.Intent;
import android.util.Log;

import com.google.android.gms.gcm.GoogleCloudMessaging;
import com.google.android.gms.iid.InstanceID;
import com.learn2crack.gcmdemo.models.RequestBody;

import java.io.IOException;

public class RegistrationIntentService extends IntentService{


    public RegistrationIntentService() {
        super("RegistrationIntentService");
    }

    @Override
    protected void onHandleIntent(Intent intent) {

        String deviceId = intent.getStringExtra("DEVICE_ID");
        String deviceName = intent.getStringExtra("DEVICE_NAME");

        try {
            InstanceID instanceID = InstanceID.getInstance(this);
            String registrationId = instanceID.getToken(getString(R.string.gcm_defaultSenderId), GoogleCloudMessaging.INSTANCE_ID_SCOPE, null);
            registerDeviceProcess(deviceName,deviceId,registrationId);

        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    private void registerDeviceProcess(String deviceName, String deviceId, String registrationId){

        Log.d("registration Id" , registrationId);
        RequestBody requestBody = new RequestBody();
        requestBody.setDeviceId(deviceId);
        requestBody.setDeviceName(deviceName);
        requestBody.setRegistrationId(registrationId);


    }
}
