import { tempimage, mill, lathe, bandsaw_soft, bandsaw_steel, drill_press_soft, drill_press_steel, vertical_mill, horizontal_bandsaw, cut_off_soft, cut_off_steel, belt_sander, spindle_sander, bandsaw_small, bandsaw_big, drill_press, table_saw, waterjet, blade_runner, grinder1, grinder2, grinder3, router_table, compound_miter_saw, sliding_miter_saw, ultimaker2p, ultimaker3, small_laser_engraver, big_laser_engraver } from '../images';

const machine_images = {
    "CNC Mill":mill,
    "Bandsaw M1":bandsaw_soft,
    "Bandsaw M2":bandsaw_steel,
    "Bandsaw (L)":bandsaw_big,
    "Bandsaw (s)":bandsaw_small,
    "Drill Press M1":drill_press_soft,
    "Drill Press M2":drill_press_steel,
    "Drill Press":drill_press,
    "CNC Lathe":lathe,
    "Bench Grinders":grinder1,
    "Grinder 2":grinder2,
    "Grinder 3":grinder3,
    "Belt Sander":belt_sander,
    "Precision Drill Press":vertical_mill,
    "Horizontal Bandsaw":horizontal_bandsaw,
    "Vertical Mill":vertical_mill,
    "Cut Off M1":cut_off_soft,
    "Cut Off M2":cut_off_steel,
    "Spindle Sander":spindle_sander,
    "Waterjet":waterjet,
    "Table Saw":table_saw,
    "Blade Runner":blade_runner,
    "Router Table":router_table,
    "Compound Saw":compound_miter_saw,
    "Sliding Saw":sliding_miter_saw,
    "Ultimaker 2p (1)":ultimaker2p,
    "Ultimaker 2p (2)":ultimaker2p,
    "Ultimaker 2p (3)":ultimaker2p,
    "Ultimaker 3 (1)":ultimaker3,
    "Ultimaker 3 (2)":ultimaker3,
    "Ultimaker 3 (3)":ultimaker3,
    "Ultimaker 3 (4)":ultimaker3,
    "Laser 0":big_laser_engraver,
    "Laser 1":small_laser_engraver,
    "Laser 2":small_laser_engraver,
    }
export default function getImage(machineName) {
    const image = machine_images[machineName];
    if (image)
        return image;
    return tempimage;
}