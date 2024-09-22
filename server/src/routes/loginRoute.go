package routes

import (
	"database/sql"

	"github.com/gofiber/fiber/v2"
)

type loginUser struct {
	ID       string `json:"id"`
	Password string `json:"password"`
	Remember bool   `json:"remember"`
}

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

	// 更新用户表中的remember字段
	if user.Remember {
		_, err = db.Exec("UPDATE users SET remember = ? WHERE id = ?", user.Remember, user.ID)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"success": false,
				"message": "更新remember字段时发生错误",
				"error":   err.Error(),
			})
		}
	}

	// 登录成功
	return c.JSON(fiber.Map{
		"success": true,
		"message": "登录成功",
		"user": fiber.Map{
			"id":       userID,
			"username": user.ID,
		},
	})
}
