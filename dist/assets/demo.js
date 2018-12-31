/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }]*/
/* global cube3d:true */

$(function() {
    const hw = $('#scene-1').width() * 0.7;
    const hh = $('#scene-1').height() * 0.7;

    const scene1 = cube3d('#scene-1').init(hw * 1.2, hh, 75);
    const cube1 = scene1.cube();

    const scene2 = cube3d('#scene-2').init(hw, hh, hw);
    const cube2 = scene2.cube();

    const scene3 = cube3d('#scene-3').init(hw, hh * 0.5, 50);
    const cube3 = scene3.cube();

    const scene4 = cube3d('#scene-4').init(hw, hh, hw);
    const cube4 = scene4.cube();

    const scene5 = cube3d('#scene-5').init(hw, hh, hw);
    const cube5 = scene5.cube();

    //const scene6 = cube3d('#scene-6').init(hw, hh * 0.5, 35);
    //const cube6 = scene6.cube();

    const scene6 = cube3d().create('.wrapper', '#scene-7', hw, hh * 0.5, 35);
    const cube6 = scene6
        .cube()
        .majorX()
        .solid();

    cube6.frontFace().text('Dynamic');

    // Flip backside
    cube3.majorX();
    cube5.majorX();

    $(scene4.el()).on('swipeleft', (event) => {
        event.preventDefault();
        cube4.rotateY(90, 400);
    });

    $(scene4.el()).on('swiperight', (event) => {
        event.preventDefault();
        cube4.rotateY(-90, 400);
    });

    $(scene5.el()).on('swipedown', (event) => {
        event.preventDefault();
        cube5.rotateX(90, 400);
    });

    $(scene5.el()).on('swipeup', (event) => {
        event.preventDefault();
        cube5.rotateX(-90, 400);
    });

    $('.cube-face').fadeIn();

    //let clicked = false;

    //$('.wrapper').on('click', () => {
    //    if (!clicked) {
    //        clicked = true;
            setInterval(() => {
                cube1.rotateY(22.5, 200);
            }, 450);

            setInterval(() => {
                cube2.rotateY(90, 1000);
            }, 1000);

            setInterval(() => {
                cube3.rotateX(90, 1000, () => {});
            }, 1000);

            let dynamic = 1;

            setInterval(() => {
                cube6.flipX(180, 500, () => {
                    cube6.backFace().text((dynamic += 1));
                });
            }, 1000);
    //    }
    //});
});
