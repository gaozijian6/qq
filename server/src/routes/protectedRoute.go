package routes

import (
	"fmt"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
)

func ProtectedRoute(c *fiber.Ctx, jwtSecret []byte) error {
	authHeader := c.Get("Authorization")
	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	if tokenString == "" {
		fmt.Println("缺少认证令牌")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"message": "缺少认证令牌",
		})
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			fmt.Println("无效的签名方法")
			return nil, fiber.NewError(fiber.StatusUnauthorized, "无效的签名方法")
		}
		return jwtSecret, nil
	})

	if err != nil || !token.Valid {
		fmt.Println("无效的认证令牌")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"message": "无效的认证令牌",
		})
	}

	return c.Next()
}
