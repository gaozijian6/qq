package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

type User struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func SetupRoutes(app *fiber.App) {
	app.Use(cors.New())

	app.Post("/register", func(c *fiber.Ctx) error {
		user := new(User)

		if err := c.BodyParser(user); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"success": false,
				"message": "无效的请求数据",
			})
		}

		return c.JSON(fiber.Map{
			"success": true,
			"message": "用户注册成功",
			"user":    user,
		})
	})
}

func StartServer() {
	app := fiber.New()

	SetupRoutes(app)

	err := app.Listen(":3000")
	if err != nil {
		panic(err)
	}
}

func main() {
	app := fiber.New()

	SetupRoutes(app)

	err := app.Listen(":3000")
	if err != nil {
		panic(err)
	}
}
