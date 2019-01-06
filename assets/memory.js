/* global newBoard:true */

/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }]*/
/* eslint-disable no-await-in-loop */

$(function() {
    const icons = [
        'fas fa-question',
        'fas fa-anchor',
        'fas fa-dove',
        'fas fa-couch',
        'fas fa-flag',
        'fas fa-star',
        'fas fa-bell',
        'fas fa-bicycle',
        'fas fa-bone',
        'fas fa-car',
        'fas fa-carrot',
        'fas fa-cat',
        'fas fa-fish',
        'fas fa-cog',
        'fas fa-bomb',
        'fas fa-crow',
        'fas fa-child',
        'fas fa-coffee',
        'fas fa-envelope'
    ];

    const colors = [
        '#d73027',
        '#f46d43',
        '#fdae61',
        '#fee090',
        '#e0f3f8',
        '#abd9e9',
        '#74add1',
        '#4575b4',
        '#762a83',
        '#9970ab',
        '#c2a5cf',
        '#e7d4e8',
        '#d9f0d3',
        '#a6dba0',
        '#5aae61',
        '#1b7837'
    ];

    const board = newBoard().create(4, icons, colors);
    const bricks = board.bricks();
    let choosen = [];
    let moves = 0;

    // Get id:s from bricks
    const _brickId = (one, two) => ({
        id1: one
            .el()
            .closest('.cube')
            .data('brick'),
        id2: two
            .el()
            .closest('.cube')
            .data('brick')
    });

    // Attach click handlers

    bricks.forEach(async (brick) => {
        $(brick.frontFace()).on('click', () => {
            if (choosen.length < 2) {
                brick.rotateYTo(180, 500, async () => {
                    choosen.push(brick);

                    if (choosen.length === 2) {
                        moves += 1;

                        const { id1, id2 } = _brickId(choosen[0], choosen[1]);

                        if (id1 !== id2) {
                            board.bork(choosen[0], choosen[1]);
                        } else if (board.match(choosen[0], choosen[1])) {
                            $('.done')
                                .html(`Completed<br>In ${moves} Moves`)
                                .animate({ opacity: 1 });
                        }
                        choosen = [];
                    }
                });
            }
        });
    });

    // Initialize the game
    const startGame = async () => {
        await board.delay(1000);
        await board.reveal();

        for (let i = 0; i < 5; i++) {
            await board.delay(500);
            await board.scramble();
        }

        await board.delay(2000);
        await board.hide();
    };

    startGame();
});
