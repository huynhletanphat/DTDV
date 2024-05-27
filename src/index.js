const { Command } = require("commander");
const addTeamCommand = require("./commands/addTeam");

const program = new Command();
program.version("1.1.0");
1
program.addCommand(addTeamCommand);

program.on("command:*", function () {
  console.error(
    "Lệnh không hợp lệ: %s\nSử dụng --help để xem danh sách các lệnh có sẵn.",
    program.args.join(" "),
  );
  process.exit(1);
});

program.parse(process.argv);
