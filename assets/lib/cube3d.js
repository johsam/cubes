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

            rotateY: (angle, duration, completeFn = undefined) => {
                angleY += angle;

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

            rotateX: (angle, duration, completeFn = undefined) => {
                angleX += angle;

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

        create: (parent, id, cubeWidth, cubeHeight, cubeDepth) => {
            const scene = $('<div/>', { id: id, class: 'scene' });
            const cube = $('<div/>', { class: 'cube' });

            $(cube).append($('<div/>', { class: 'cube-face cube-face-front' }));
            $(cube).append($('<div/>', { class: 'cube-face cube-face-back' }));

            $(cube).append($('<div/>', { class: 'cube-face cube-face-left' }));
            $(cube).append($('<div/>', { class: 'cube-face cube-face-right' }));

            $(cube).append($('<div/>', { class: 'cube-face cube-face-top' }));
            $(cube).append($('<div/>', { class: 'cube-face cube-face-bottom' }));

            $(scene).append(cube);
            $(parent).append(scene);

            _selector = scene;
            return self.init(cubeWidth, cubeHeight, cubeDepth);
        }
    };

    return self;
};
