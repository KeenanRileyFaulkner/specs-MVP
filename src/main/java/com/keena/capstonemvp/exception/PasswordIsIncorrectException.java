package com.keena.capstonemvp.exception;

public class PasswordIsIncorrectException extends RuntimeException {
    public PasswordIsIncorrectException(String message) {
        super(message);
    }
}
