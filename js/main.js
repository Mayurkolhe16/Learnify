// Learnify Platform - Main JavaScript

/**
 * Main application module
 * Uses IIFE pattern for encapsulation and to avoid global namespace pollution
 */
(function() {
    'use strict';

    /**
     * DOM Ready Handler
     * Initializes all JavaScript functionality once the DOM is fully loaded
     * This ensures all HTML elements are available before attempting to manipulate them
     */
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize all modules
        initMobileMenu();
    });

    /**
     * Initialize mobile menu toggle functionality
     * Adds click event listener to hamburger button to toggle menu visibility
     */
    function initMobileMenu() {
        const navbarToggle = document.querySelector('.navbar-toggle');
        const navbarMenu = document.querySelector('.navbar-menu');

        if (navbarToggle && navbarMenu) {
            navbarToggle.addEventListener('click', function() {
                navbarMenu.classList.toggle('active');
            });
        }
    }

    /**
     * Form Validation Helpers
     * Utility functions for validating common form fields
     */

    /**
     * Validates email format
     * @param {string} email - The email address to validate
     * @returns {boolean} True if email is valid, false otherwise
     */
    function isValidEmail(email) {
        if (!email || typeof email !== 'string') {
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    }

    /**
     * Validates password strength
     * Password must be at least 8 characters long
     * @param {string} password - The password to validate
     * @returns {boolean} True if password meets requirements, false otherwise
     */
    function isValidPassword(password) {
        if (!password || typeof password !== 'string') {
            return false;
        }
        return password.length >= 8;
    }

    /**
     * Validates that a field is not empty
     * @param {string} value - The value to validate
     * @returns {boolean} True if value is not empty, false otherwise
     */
    function isRequired(value) {
        if (value === null || value === undefined) {
            return false;
        }
        return String(value).trim().length > 0;
    }

    /**
     * Validates minimum length
     * @param {string} value - The value to validate
     * @param {number} minLength - Minimum required length
     * @returns {boolean} True if value meets minimum length, false otherwise
     */
    function hasMinLength(value, minLength) {
        if (!value || typeof value !== 'string') {
            return false;
        }
        return value.trim().length >= minLength;
    }

    /**
     * Validates maximum length
     * @param {string} value - The value to validate
     * @param {number} maxLength - Maximum allowed length
     * @returns {boolean} True if value is within maximum length, false otherwise
     */
    function hasMaxLength(value, maxLength) {
        if (!value || typeof value !== 'string') {
            return false;
        }
        return value.trim().length <= maxLength;
    }

    /**
     * Validates that two values match (useful for password confirmation)
     * @param {string} value1 - First value
     * @param {string} value2 - Second value
     * @returns {boolean} True if values match, false otherwise
     */
    function valuesMatch(value1, value2) {
        return value1 === value2;
    }

    // Export validation functions to global scope for use in forms
    window.FormValidation = {
        isValidEmail: isValidEmail,
        isValidPassword: isValidPassword,
        isRequired: isRequired,
        hasMinLength: hasMinLength,
        hasMaxLength: hasMaxLength,
        valuesMatch: valuesMatch
    };

})();
