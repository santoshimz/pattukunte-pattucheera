import Modal from "react-modal";
import React from "react";
import PropTypes from "prop-types";
import imageIcon from "../assets/image.png";
import viewIcon from "../assets/view.png";
import numberFiveIcon from "../assets/number-five.png";

const RulesModal = ({ openRulesModal, setOpenRulesModal }) => {
  return (
    <Modal
      className="modern-modal p-8 max-w-2xl"
      isOpen={openRulesModal}
      onRequestClose={() => setOpenRulesModal(false)}
      ariaHideApp={false}
      style={{
        content: {
          position: "absolute",
          top: "50%",
          right: "50%",
          transform: "translate(50%,-50%)"
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(4px)"
        }
      }}>
      {/* Modal Header */}
      <div className="modal-header">
        <h3 className="modal-title">🎮 How to Play</h3>
        <button
          onClick={() => setOpenRulesModal(false)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {/* Rules Content */}
      <div className="space-y-5 lg:space-y-6">
        {/* Rule 1 */}
        <div className="card p-5 lg:p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-l-4 border-blue-500">
          <div className="flex gap-5 lg:gap-6 items-start">
            <div className="flex-shrink-0">
              <img className="w-14 lg:w-16 h-auto" src={imageIcon} alt="Image icon" />
            </div>
            <div>
              <h4 className="font-bold text-base lg:text-lg text-slate-900 dark:text-slate-100 mb-2">
                Use Images to Guess
              </h4>
              <p className="text-sm lg:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                You are given a movie poster or scene image. Try to identify the Tollywood movie!
              </p>
            </div>
          </div>
        </div>

        {/* Rule 2 */}
        <div className="card p-5 lg:p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-l-4 border-purple-500">
          <div className="flex gap-5 lg:gap-6 items-start">
            <div className="flex-shrink-0">
              <img className="w-14 lg:w-16 h-auto" src={viewIcon} alt="View icon" />
            </div>
            <div>
              <h4 className="font-bold text-base lg:text-lg text-slate-900 dark:text-slate-100 mb-2">
                Progressive Clues
              </h4>
              <p className="text-sm lg:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Each wrong guess reveals a new image from the same movie. More guesses = more clues!
              </p>
            </div>
          </div>
        </div>

        {/* Rule 3 */}
        <div className="card p-5 lg:p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-l-4 border-green-500">
          <div className="flex gap-5 lg:gap-6 items-start">
            <div className="flex-shrink-0">
              <img className="w-12 lg:w-14 h-auto" src={numberFiveIcon} alt="Number five icon" />
            </div>
            <div>
              <h4 className="font-bold text-base lg:text-lg text-slate-900 dark:text-slate-100 mb-2">
                Five Chances to Win
              </h4>
              <p className="text-sm lg:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                You have 5 attempts to guess correctly. Choose your answers wisely!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-8 lg:mt-10 p-5 lg:p-6 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700">
        <p className="text-sm lg:text-base text-slate-700 dark:text-slate-300 text-center font-medium">
          🎬 New movie every day! Play daily to build your streak!
        </p>
      </div>
    </Modal>
  );
};

RulesModal.propTypes = {
  openRulesModal: PropTypes.bool,
  setOpenRulesModal: PropTypes.func
};

export default RulesModal;
