<!--
{
    "Id": "Buddhabrot",
	"WindowTitle": "",
	"Title": "A short Introduction to the Buddhabrot",
    "Date": "2015-06-01"
}
-->

## A short Introduction to the Buddhabrot

The Buddhabrot is an alternative representation of the Mandelbrot set. As such, we must first figure out how the Mandelbrot set works.

In short, the Mandelbrot set consists of all points c that fulfill the following condition:

	z_n+1 = z_n^2 + c
	z_n+1 remains bounded as n approaches infinity.

Now, what does that actually mean? Simply, it means that if we iteratively compute z_1, z_2... z_n, the numbers do not grow larger and larger, but rather stay bounded (by which I mean the |z_i|, the absolute value, the length of the vector from 0,0 to Re(z_i),Im(z_i), is below some threshold)

But we often see images like these: 

![](https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Mandel_zoom_00_mandelbrot_set.jpg/322px-Mandel_zoom_00_mandelbrot_set.jpg) 

Here, the picture shows different colors, depending on how many iterations it took for the sequence of numbers z_1...z_i to escape some pre-set boundary. In practice, a boundary of 2.0 is a good choice, as all the numbers in the Mandelbrot set lie within the circle with center 0,0 and radius 2.0. The color is used to represent the number of iterations it takes to escape that boundary.

When you render the Mandelbrot set as a picture, you do so for every point c, where c is a pixel on the photo. The Buddhabrot is a different rendering of the same dataset.

Instead of simply coloring the point c based on how many iterations it took to escape the boundary, we plot the sequence {z_i}, for any point c that escapes. As we cannot in practice compute an infinite number of iterations for every point (remember, the Mandelbrot formula states "z_n+1 remains bounded as n approaches *infinity*) we have to select some threshold for the number of iterations before we "give up", and assume that the point remains bounded. The output varies significantly depending on the threshold we choose. 

## Initial version: C&#35;

The initial version I built uses multiple threads, each with its own buffer to store the output. I did this as I noticed that if I shared a single buffer between all the threads, I had to use Interlocked.Increment() to increase the pixel values in the buffer, otherwise artefacts would show up in the picture due to multiple treads modifying the same data simultaneously, and the increment would do be computed correctly.

Instead, each thread has its own buffer, and all the buffers get combined in the end.

Running the program with the following arguments:

	-file c:\\brotCpu.bmp -w 2160 -h 3840 -it 1000 -xmin -2.0 -xmax 1.1 -samples 1000000000

gives the following output:

	...
	...
	Calculated 920,0 Million samples in 37,961 sec
	Calculated 930,0 Million samples in 38,069 sec
	Calculated 940,0 Million samples in 38,131 sec
	Calculated 950,0 Million samples in 38,166 sec
	Calculated 960,0 Million samples in 38,169 sec
	Calculated 970,0 Million samples in 41,052 sec
	Calculated 980,0 Million samples in 41,075 sec
	Calculated 990,0 Million samples in 41,110 sec
	Calculated 1000,0 Million samples in 41,121 sec

![](Content/Buddhabrot/brotCpu.png)

The image has been scaled to 25% and rotated 90 degrees clockwise.

On my 6 core (hyperthreading) i7 Extreme, the C# version computes 24.3 million samples per second. 

## Second version: Nvidia Cuda

I decided that the Buddhabrot would make a good test case for integrating Cuda and C#. I have previously worked with Cuda, but not from C#, and I had been curious to explore the different options of doing so.

I eventually settled on using Managed Cuda, as the API is quite nice (although seriously under-documented). I particularly like the ability for load PTX files directly at runtime. This allows you write you Cuda kernel in a separate project, and then dynamically load it into your C# program.

### Results

	Starting...
	Generated 214,8 Million samples in 0,773 sec
	Generated 429,7 Million samples in 1,544 sec
	Generated 644,5 Million samples in 2,315 sec
	Generated 859,3 Million samples in 3,087 sec

That looks a lot faster than before. On my GeForce 780 Superclocked, the Cuda version computes 278.4 million samples per second. That is an improvement of ~ 11.5x over the CPU version.

You can find the code **[on Github](https://github.com/ValdemarOrn/Buddhabrot)**

