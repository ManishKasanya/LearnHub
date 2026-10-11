package com.learnhub.dto.request;

public class ProfileUpdateRequest {

    private String fullName;
    private String headline;
    private String bio;
    private String avatarUrl;

    public ProfileUpdateRequest() {
    }

    public ProfileUpdateRequest(String fullName, String headline, String bio, String avatarUrl) {
        this.fullName = fullName;
        this.headline = headline;
        this.bio = bio;
        this.avatarUrl = avatarUrl;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getHeadline() {
        return headline;
    }

    public void setHeadline(String headline) {
        this.headline = headline;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }
}
