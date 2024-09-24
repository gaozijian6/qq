package routes

import (
	"database/sql"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

type registerUser struct {
	Username        string `json:"username"`
	Email           string `json:"email"`
	Password        string `json:"password"`
	ConfirmPassword string `json:"confirmPassword"`
	Remember        bool   `json:"remember"`
	Avatar          string `json:"avatar"`
}

func RegisterRoute(c *fiber.Ctx, db *sql.DB) error {
	user := new(registerUser)

	if err := c.BodyParser(user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "无效的请求数据",
		})
	}

	// 检查必填字段
	if user.Username == "" || user.Email == "" || user.Password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "用户名、邮箱和密码为必填项",
		})
	}

	// 检查密码是否匹配
	if user.Password != user.ConfirmPassword {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "密码和确认密码不匹配",
		})
	}

	// 检查邮箱是否已存在
	var count int
	err := db.QueryRow("SELECT COUNT(*) FROM users WHERE email = ?", user.Email).Scan(&count)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "检查邮箱时发生错误",
		})
	}
	if count > 0 {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"success": false,
			"message": "邮箱已存在",
		})
	}

	// 插入用户数据
	result, err := db.Exec("INSERT INTO users (username, email, password, avatar) VALUES (?, ?, ?, ?)",
		user.Username, user.Email, user.Password, user.Avatar)
	if err != nil {
		fmt.Printf("数据库错误: %v\n", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "用户注册失败",
			"error":   err.Error(),
		})
	}

	// 获取插入的ID
	id, _ := result.LastInsertId()
	fmt.Printf("result: %v\n", result)

	return c.JSON(fiber.Map{
		"success": true,
		"message": "用户注册成功",
		"user": fiber.Map{
			"id":       id,
			"username": user.Username,
			"email":    user.Email,
		},
	})
}
