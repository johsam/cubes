/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }]*/

// eslint-disable-next-line
const cube3d = selector => {
    let _selector = $(selector);

    const g2r = a => (a * Math.PI) / 180.0;

    const _cube = (cubeSelector) => {
        const target = $(cubeSelector);

        let angleX = 0;
        let angleY = 0;

        const self = {
            el: () => target,
            majorX: () => {
                $(target)
                    .find('.cube-face-back')
                    .snabbt({ rotation: [0, g2r(180), g2r(180)], duration: 0 });
                return self;
            },

            solid: () => {
                $(target)
                    .find('.cube-face')
                    .css('backface-visibility', 'hidden');
                return self;
            },

            frontFace: () => $(target).find('.cube-face-front'),
            backFace: () => $(target).find('.cube-face-back'),

            topFace: () => $(target).find('.cube-face-top'),
            bottomFace: () => $(target).find('.cube-face-bottom'),

            leftFace: () => $(target).find('.cube-face-left'),
            rightFace: () => $(target).find('.cube-face-right'),

            rotateYTo: (angle, duration, completeFn = undefined) => {
                angleY = angle;

                $(target).snabbt({
                    rotation: [g2r(angleX), g2r(angleY + 0.05), 0],
                    duration: duration,
                    easing: 'easeOut',
                    complete: () => {
                        if (angleY >= 360 || angleY <= -360) {
                            angleY %= 360;
                            $(target).snabbt({ rotation: [g2r(angleX), g2r(angleY + 0.05), 0], duration: 0 });
                        }
                        if (completeFn) {
                            completeFn(angleY);
                        }
                    }
                });
            },

            rotateY: (angle, duration, completeFn = undefined) => {
                self.rotateYTo(angleY + angle, duration, completeFn);
            },

            rotateXTo: (angle, duration, completeFn = undefined) => {
                angleX = angle;

                $(target).snabbt({
                    rotation: [g2r(angleX), g2r(angleY), 0],
                    duration: duration,
                    easing: 'easeOut',

                    complete: () => {
                        if (angleX >= 360 || angleX <= -360) {
                            angleX %= 360;
                            $(target).snabbt({ rotation: [g2r(angleX), g2r(angleY), 0], duration: 0 });
                        }
                        if (completeFn) {
                            completeFn(target, angleX);
                        }
                    }
                });
            },

            rotateX: (angle, duration, completeFn = undefined) => {
                self.rotateXTo(angleX + angle, duration, completeFn);
            },

            shake: (interval = 100, distance = 10) => {
                const times = 3;
                const damping = 0.8;

                for (let i = 0; i < times + 1; i++) {
                    // eslint-disable-next-line
                    const amt = (Math.pow(-1, i) * distance) / (i * damping);
                    $(target).animate(
                        {
                            top: amt
                        },
                        100
                    );
                }
                $(target).animate(
                    {
                        top: 0
                    },
                    interval
                );
            },

            flipX: (angle, duration, flipFn, completeFn = undefined) => {
                angleX += angle;
                let flipFnCalled = false;

                $(target).snabbt({
                    rotation: [g2r(angleX), g2r(angleY), 0],
                    duration: duration,
                    easing: 'easeOut',

                    update: (i /*, index, total*/) => {
                        if (!flipFnCalled && i > 0.3 && angleX === 180) {
                            flipFnCalled = true;
                            if (flipFn) {
                                flipFn(target, angleX);
                            }
                        }
                    },

                    complete: () => {
                        if (angleX >= 360 || angleX <= -360) {
                            angleX %= 360;
                            $(target).snabbt({ rotation: [g2r(angleX), g2r(angleY), 0], duration: 0 });
                        }
                        if (completeFn) {
                            completeFn(target, angleX);
                        }
                    }
                });
            }
        };

        return self;
    };

    const _init = (cubeWidth, cubeHeight, cubeDepth) => {
        const _scene = $(_selector);
        const _cubeEl = $(_scene).find('.cube');

        const halfWidth = cubeWidth / 2;
        const halfHeight = cubeHeight / 2;
        const halfDepth = cubeDepth / 2;

        const leftFace = $(_cubeEl).find('.cube-face-left');
        const rightFace = $(_cubeEl).find('.cube-face-right');

        const frontFace = $(_cubeEl).find('.cube-face-front');
        const backFace = $(_cubeEl).find('.cube-face-back');

        const topFace = $(_cubeEl).find('.cube-face-top');
        const bottomFace = $(_cubeEl).find('.cube-face-bottom');

        const faceDuration = 0;

        const sceneWidth = $(_scene).width();
        const sceneHeight = $(_scene).height();
        const dw = (sceneWidth - cubeWidth) / 2;
        const dh = (sceneHeight - cubeHeight) / 2;

        // Front face
        $(frontFace)
            .css('width', cubeWidth)
            .css('height', cubeHeight)
            .css('line-height', cubeHeight + 'px');
        $(frontFace).snabbt({ rotation: [0, g2r(0), 0], position: [sceneWidth / 2 - halfWidth, -halfHeight, halfDepth], duration: faceDuration });

        // Back face
        $(backFace)
            .css('width', cubeWidth)
            .css('height', cubeHeight)
            .css('line-height', cubeHeight + 'px');
        $(backFace).snabbt({ rotation: [0, g2r(180), 0], position: [sceneWidth / 2 - halfWidth, -halfHeight, -halfDepth], duration: faceDuration });

        // Left face
        $(leftFace)
            .width(cubeDepth)
            .css('height', cubeHeight)
            .css('line-height', cubeHeight + 'px');
        $(leftFace).snabbt({ rotation: [0, g2r(90), 0], position: [dw - halfDepth, -halfHeight, 0], duration: faceDuration });

        // Right face
        $(rightFace)
            .width(cubeDepth)
            .css('height', cubeHeight)
            .css('line-height', cubeHeight + 'px');
        $(rightFace).snabbt({ rotation: [0, g2r(-90), 0], position: [-dw + sceneWidth - halfDepth, -halfHeight, 0], duration: faceDuration });

        // Top face
        $(topFace)
            .height(cubeDepth)
            .width(cubeWidth)
            .css('line-height', cubeDepth + 'px');
        $(topFace).snabbt({ rotation: [g2r(-90), 0, 0], position: [sceneWidth / 2 - halfWidth, dh - sceneHeight / 2 - halfDepth, 0], duration: faceDuration });

        // Bottom face
        $(bottomFace)
            .height(cubeDepth)
            .width(cubeWidth)
            .css('line-height', cubeDepth + 'px');
        $(bottomFace).snabbt({ rotation: [g2r(90), 0, 0], position: [sceneWidth / 2 - halfWidth, -dh + sceneHeight / 2 - halfDepth, 0], duration: faceDuration });

        // Push back cube
        $(_cubeEl).snabbt({ rotation: [0, 0, 0], position: [0, sceneHeight / 2, -halfDepth], duration: 0 });
    };

    const self = {
        init: (cubeWidth, cubeHeight, cubeDepth) => {
            _init(cubeWidth, cubeHeight, cubeDepth);
            return {
                el: () => _selector,
                cube: () => _cube(_selector.find('.cube'))
            };
        },

        createEl: (parent, id) => {
            const _sceneEl = $('<div/>', { id: id, class: 'scene' });
            const _cubeEl = $('<div/>', { class: 'cube' });

            $(_cubeEl).append($('<div/>', { class: 'cube-face cube-face-front' }));
            $(_cubeEl).append($('<div/>', { class: 'cube-face cube-face-back' }));

            $(_cubeEl).append($('<div/>', { class: 'cube-face cube-face-left' }));
            $(_cubeEl).append($('<div/>', { class: 'cube-face cube-face-right' }));

            $(_cubeEl).append($('<div/>', { class: 'cube-face cube-face-top' }));
            $(_cubeEl).append($('<div/>', { class: 'cube-face cube-face-bottom' }));

            $(_sceneEl).append(_cubeEl);
            $(parent).append(_sceneEl);

            return _sceneEl;
        },

        create: (parent, id, cubeWidth, cubeHeight, cubeDepth) => {
            const _scene = self.createEl(parent, id);
            _selector = _scene;

            return self.init(cubeWidth, cubeHeight, cubeDepth);
        }
    };

    return self;
};
