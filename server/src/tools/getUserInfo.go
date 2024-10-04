package tools

import (
	"database/sql"
)

type UserInfo struct {
	ID           string `json:"id"`
	Username     string `json:"username"`
	Avatar       string `json:"avatar"`
	Introduction string `json:"introduction"`
}

func GetUserInfo(userID string, db *sql.DB) (UserInfo, error) {
	var user UserInfo
	err := db.QueryRow("SELECT id, username, avatar, introduction FROM users WHERE id = ?", userID).Scan(&user.ID, &user.Username, &user.Avatar, &user.Introduction)
	if err != nil {
		return UserInfo{}, err
	}
	return user, nil
}
