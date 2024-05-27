const { Command } = require("commander");
const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const infoChangeCommand = new Command()
  .name("info")
  .description("Thay đổi thông tin của đội tuyển hoặc người chơi")
  .action(() => {
    rl.question(
      "Chọn mode (1: thay đổi thông tin đội tuyển, 2: thay đổi thông tin player): ",
      (mode) => {
        if (mode === "1") {
          changeTeamInfo();
        } else if (mode === "2") {
          changePlayerInfo();
        } else {
          console.log("Mode không hợp lệ.");
          rl.close();
        }
      },
    );
  });

function changeTeamInfo() {
  rl.question("Nhập tên đội tuyển cần thay đổi thông tin: ", (teamName) => {
    fs.readFile("data.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        rl.close();
        return;
      }
      let teams = JSON.parse(data);
      const teamIndex = teams.findIndex((team) => team.nameTeam === teamName);
      if (teamIndex !== -1) {
        rl.question(
          "Bạn muốn thay đổi thông tin (tên/points/GD/games) của đội tuyển (y/n)? ",
          (answer) => {
            if (answer.toLowerCase() === "y") {
              rl.question("Nhập tên mới của đội tuyển: ", (newTeamName) => {
                rl.question("Nhập số điểm mới: ", (newPoints) => {
                  rl.question("Nhập hiệu số mới: ", (newGD) => {
                    rl.question("Nhập số trận đấu mới: ", (newGames) => {
                      teams[teamIndex].nameTeam = newTeamName;
                      teams[teamIndex].point = parseInt(newPoints);
                      teams[teamIndex].GD = parseInt(newGD);
                      teams[teamIndex].games = parseInt(newGames);
                      saveData(teams);
                    });
                  });
                });
              });
            } else {
              rl.question(
                "Bạn có chắc chắn muốn xóa thông tin đội tuyển (y/n)? ",
                (answer) => {
                  if (answer.toLowerCase() === "y") {
                    teams.splice(teamIndex, 1);
                    saveData(teams);
                  } else {
                    console.log(
                      "Không thực hiện thay đổi thông tin đội tuyển.",
                    );
                    rl.close();
                  }
                },
              );
            }
          },
        );
      } else {
        console.log("Không tìm thấy đội tuyển.");
        rl.close();
      }
    });
  });
}

function saveData(teams) {
  fs.writeFile("data.json", JSON.stringify(teams, null, 4), (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Đã lưu thông tin đội tuyển.");
    }
    rl.close();
  });
}

function changePlayerInfo() {
  rl.question("Nhập tên đội tuyển: ", (teamName) => {
    fs.readFile("data.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        rl.close();
        return;
      }
      const teams = JSON.parse(data);
      const team = teams.find((team) => team.nameTeam === teamName);
      if (!team) {
        console.log("Không tìm thấy đội tuyển.");
        rl.close();
        return;
      }
      console.log("Danh sách players:");
      team.players.forEach((player, index) => {
        console.log(`${index + 1}. ${player.namePlayer}`);
      });
      rl.question(
        "Chọn số thứ tự của player cần thay đổi thông tin: ",
        (playerIndex) => {
          const selectedPlayerIndex = parseInt(playerIndex) - 1;
          if (
            selectedPlayerIndex < 0 ||
            selectedPlayerIndex >= team.players.length
          ) {
            console.log("Số thứ tự không hợp lệ.");
            rl.close();
            return;
          }
          rl.question(
            "Bạn muốn thay đổi thông tin (tên/Kill/MvpWin/MvpLoss) của player (y/n)? ",
            (answer) => {
              if (answer.toLowerCase() === "y") {
                rl.question("Nhập tên mới của player: ", (newPlayerName) => {
                  rl.question("Nhập số Kill mới: ", (newKills) => {
                    rl.question("Nhập số MvpWin mới: ", (newMvpWin) => {
                      rl.question("Nhập số MvpLoss mới: ", (newMvpLoss) => {
                        team.players[selectedPlayerIndex].namePlayer =
                          newPlayerName;
                        team.players[selectedPlayerIndex].Kills =
                          parseInt(newKills);
                        team.players[selectedPlayerIndex].MvpWin =
                          parseInt(newMvpWin);
                        team.players[selectedPlayerIndex].MvpLoss =
                          parseInt(newMvpLoss);
                        saveData(teams);
                      });
                    });
                  });
                });
              } else {
                rl.question(
                  "Bạn có muốn xóa thông tin player này (y/n)? ",
                  (answer) => {
                    if (answer.toLowerCase() === "y") {
                      team.players.splice(selectedPlayerIndex, 1);
                      saveData(teams);
                    } else {
                      console.log("Không thực hiện thay đổi thông tin player.");
                      rl.close();
                    }
                  },
                );
              }
            },
          );
        },
      );
    });
  });
}

module.exports = infoChangeCommand;
