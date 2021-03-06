import { expect } from "chai";
import { BasicTests } from "test/helper/Basic";
import { Offline } from "test/helper/Offline";
import { PassAudio } from "test/helper/PassAudio";
import { Signal } from "Tone/signal/Signal";
import { Panner } from "./Panner";

describe("Panner", () => {

	BasicTests(Panner);

	context("Panning", () => {

		it("can be constructed with the panning value", () => {
			const panner = new Panner(0.3);
			expect(panner.pan.value).to.be.closeTo(0.3, 0.001);
			panner.dispose();
		});

		it("can be constructed with an options object", () => {
			const panner = new Panner({
				pan: 0.5,
			});
			expect(panner.pan.value).to.be.closeTo(0.5, 0.001);
			panner.dispose();
		});

		it("passes the incoming signal through", () => {
			return PassAudio((input) => {
				const panner = new Panner().toDestination();
				input.connect(panner);
			});
		});

		it("pans hard left when the pan is set to -1", () => {
			return Offline(() => {
				const panner = new Panner(-1).toDestination();
				new Signal(1).connect(panner);
			}, 0.1, 2).then((buffer) => {
				const l = buffer.toArray()[0];
				const r = buffer.toArray()[1];
				expect(l[0]).to.be.closeTo(1, 0.01);
				expect(r[0]).to.be.closeTo(0, 0.01);
			});
		});

		it("pans hard right when the pan is set to 1", () => {
			return Offline(() => {
				const panner = new Panner(1).toDestination();
				new Signal(1).connect(panner);
			}, 0.1, 2).then((buffer) => {
				const l = buffer.toArray()[0];
				const r = buffer.toArray()[1];
				expect(l[0]).to.be.closeTo(0, 0.01);
				expect(r[0]).to.be.closeTo(1, 0.01);
			});
		});

		it("mixes the signal in equal power when panned center", () => {
			return Offline(() => {
				const panner = new Panner(0).toDestination();
				new Signal(1).connect(panner);
			}, 0.1, 2).then((buffer) => {
				const l = buffer.toArray()[0];
				const r = buffer.toArray()[1];
				expect(l[0]).to.be.closeTo(0.707, 0.01);
				expect(r[0]).to.be.closeTo(0.707, 0.01);
			});
		});
	});
});
