const { Command } = require("commander");
const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const addTeamCommand = new Command()
  .name("add")
  .description("Tạo 1 team vào dữ liệu sever")
  .action(() => {
    rl.question("Nhập tên đội tuyển: ", (teamName) => {
      checkDuplicateTeamName(teamName, (isDuplicate) => {
        if (isDuplicate) {
          console.log("Tên đội tuyển đã tồn tại, vui lòng nhập lại từ đầu.");
          rl.close();
        } else {
          rl.question("Nhập số người chơi trong đội: ", (numPlayers) => {
            const team = {
              name: teamName,
              point: 0,
              GD: 0,
              games: 0,
              players: [],
            };

            addPlayer(team, 0, parseInt(numPlayers));
          });
        }
      });
    });
  });

function addPlayer(team, currentPlayer, totalPlayers) {
  if (currentPlayer < totalPlayers) {
    rl.question(`Người chơi thứ ${currentPlayer + 1} Tên: `, (playerName) => {
      // Kiểm tra trùng tên người chơi
      if (team.players.some((player) => player.name === playerName)) {
        console.log("Tên người chơi đã tồn tại, vui lòng nhập lại.");
        addPlayer(team, currentPlayer, totalPlayers);
      } else {
        const player = {
          name: playerName,
          mvps: 0,
          kills: 0,
        };
        team.players.push(player);
        addPlayer(team, currentPlayer + 1, totalPlayers);
      }
    });
  } else {
    saveTeam(team);
  }
}

function saveTeam(team) {
  fs.readFile("data.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    let teams = [];
    if (data) {
      teams = JSON.parse(data);
    }
    teams.push(team);
    fs.writeFile("data.json", JSON.stringify(teams, null, 4), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Team đã được lưu vào data.json");
      rl.close();
    });
  });
}

function checkDuplicateTeamName(teamName, callback) {
  fs.readFile("data.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const teams = JSON.parse(data);
    const isDuplicate = teams.some(
      (existingTeam) => existingTeam.name === teamName,
    );
    callback(isDuplicate);
  });
}

module.exports = addTeamCommand;
