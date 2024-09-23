package routes

import (
	"database/sql"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
)

type loginUser struct {
	ID           string `json:"id"`
	Password     string `json:"password"`
	Remember     bool   `json:"remember"`
	Introduction string `json:"introduction"`
	Avatar       string `json:"avatar"`
}

var jwtSecret = []byte("your_secret_key")

func LoginRoute(c *fiber.Ctx, db *sql.DB) error {
	user := new(loginUser)

	if err := c.BodyParser(user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "无效的请求数据",
		})
	}

	// 检查必填字段
	if user.ID == "" || user.Password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "用户名和密码为必填项",
		})
	}

	// 检查用户ID是否存在并验证密码
	var storedPassword string
	var userID int64
	err := db.QueryRow("SELECT id, password FROM users WHERE id = ?", user.ID).Scan(&userID, &storedPassword)
	if err != nil {
		if err == sql.ErrNoRows {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"success": false,
				"message": "用户不存在",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "验证用户时发生错误",
			"error":   err.Error(),
		})
	}

	if storedPassword != user.Password {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"message": "密码不正确",
		})
	}

	// 生成JWT
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userID": userID,
		"exp":    time.Now().Add(time.Hour * 72).Unix(),
	})

	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "生成JWT时发生错误",
			"error":   err.Error(),
		})
	}

	// 登录成功
	return c.JSON(fiber.Map{
		"success": true,
		"message": "登录成功",
		"token":   tokenString,
		"user": fiber.Map{
			"id":           userID,
			"username":     user.ID,
			"introduction": user.Introduction,
			"avatar":       user.Avatar,
		},
	})
}
