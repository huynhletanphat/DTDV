const { Command } = require("commander");
const fs = require("fs");
const path = require("path");

const program = new Command();
program.version("1.0.0");

// Đọc tất cả các file trong thư mục src/commands
const commandFiles = fs.readdirSync(path.join(__dirname, "commands"));

// Lặp qua từng file và thêm lệnh vào chương trình
commandFiles.forEach((file) => {
  // Kiểm tra nếu là file JavaScript
  if (file.endsWith(".js")) {
    try {
      const command = require(`./commands/${file}`);
      program.addCommand(command);
    } catch (error) {
      console.error(`Không thể tải lệnh từ file ${file}:`, error);
    }
  }
});

// Parse các đối số dòng lệnh
program.parse(process.argv);
