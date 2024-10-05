package routes

import (
	"database/sql"
	"fmt"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
)

func UserInfoRoute(c *fiber.Ctx, db *sql.DB, jwtSecret []byte) error {
	authHeader := c.Get("Authorization")
	if authHeader == "" {
		fmt.Println("未提供认证令牌", authHeader)
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"message": "未提供认证令牌",
		})
	}

	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if err != nil || !token.Valid {
		fmt.Println("无效的认证令牌")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"message": "无效的认证令牌",
		})
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		fmt.Println("无法解析令牌声明")
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "无法解析令牌声明",
		})
	}

	userID, ok := claims["userID"].(float64)
	if !ok {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "无法获取用户ID",
		})
	}

	var username, introduction, avatar string
	err = db.QueryRow("SELECT username, introduction, avatar FROM users WHERE id = ?", int64(userID)).Scan(&username, &introduction, &avatar)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "获取用户信息失败",
			"error":   err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "获取用户信息成功",
		"user": fiber.Map{
			"id":           int64(userID),
			"username":     username,
			"introduction": introduction,
			"avatar":       avatar,
		},
	})
}
