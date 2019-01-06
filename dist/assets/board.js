/* global cube3d:true,*/
/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }]*/
/* eslint-disable no-await-in-loop */
/* eslint no-restricted-syntax: ["off", "ForInStatement"] */

// eslint-disable-next-line
const newBoard = () => {
    const _bricks = [];
    let _classes = [];
    let _colors = [];
    const _order = [];
    let _dimension = 0;
    let _matches = 0;

    const _selectors = (one, two) => {
        const sc1 = $(one.el())
            .closest('.scene')
            .attr('id');
        const sc2 = $(two.el())
            .closest('.scene')
            .attr('id');

        return `#${sc1},#${sc2}`;
    };

    const self = {
        bricks: () => _bricks,

        delay: amount => new Promise((resolve) => {
            setTimeout(resolve, amount);
        }),

        reveal: async () => new Promise(async (resolve) => {
            // forEach doesn't work with await here...
            for (const brick of _bricks) {
                brick.rotateYTo(180, 500);
                await self.delay(50);
            }

            resolve();
        }),

        hide: async () => new Promise(async (resolve) => {
            // forEach doesn't work with await here...
            for (const brick of _bricks.reverse()) {
                if (brick.el().data('brick') !== 0) {
                    brick.rotateYTo(0, 500);
                }
                await self.delay(50);
            }
            resolve();
        }),

        scramble: async () => new Promise(async (resolve) => {
            _order.sort(() => 0.5 - Math.random());

            _bricks.forEach((brick, idx) => {
                const rnd = _order[idx];
                const color = rnd % _colors.length;

                $(brick.el())
                    .data('brick', rnd)
                    .attr('brick', rnd);
                $(brick.backFace())
                    .empty()
                    .css('background-color', _colors[color])
                    .append($('<i/>', { class: _classes[rnd] }));
            });

            resolve();
        }),

        match: (one, two) => {
            _matches += 1;

            $(_selectors(one, two)).snabbt({
                fromPosition: [0, -5, 0],
                position: [0, 0, 0],
                easing: 'spring',
                springConstant: 1.9,
                springDeceleration: 0.8
            });
            return _matches === Math.floor((_dimension * _dimension) / 2);
        },

        bork: (one, two) => {
            $(_selectors(one, two)).snabbt({
                fromRotation: [0, 0, -Math.PI / 16],
                rotation: [0, 0, 0],
                easing: 'spring',
                springConstant: 2.9,
                springDeceleration: 0.8,
                allDone: () => {
                    one.rotateYTo(360, 500);
                    two.rotateYTo(360, 500);
                }
            });
        },

        create: (dim, classes, colors) => {
            _dimension = dim;
            _classes = classes.slice();
            _colors = colors.slice();

            _colors.sort(() => 0.5 - Math.random());

            // Initial sort, Make sure we don't move the first class
            // Used for odd size of board

            const first = _classes.shift();
            _classes.sort(() => 0.5 - Math.random());
            _classes.unshift(first);

            $('.board').css('grid-template-columns', `repeat(${dim},auto)`);

            // Create dom elements

            for (let l = 0; l < dim * dim; l++) {
                cube3d().createEl('.board', `scene-${l + 1}`);
            }

            // Create the bricks

            const brickWidth = Math.floor($('.board-wrapper').width() / dim - (dim - 1) * 2);

            for (let l = 0; l < dim * dim; l++) {
                const scene = cube3d(`#scene-${l + 1}`).init(brickWidth, brickWidth, 25);
                const cube = scene.cube().solid();
                _bricks.push(cube);
                _order.push(1 + (Math.floor(l / 2) % _classes.length));
            }

            // If odd size then last item is always the first class
            if (dim % 2 === 1) {
                _order[_order.length - 1] = 0;
            }

            self.scramble();
            return self;
        }
    };

    return self;
};
